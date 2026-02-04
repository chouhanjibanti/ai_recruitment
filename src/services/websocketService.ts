import { store } from '../store';
import { updateSessionStatus, addTranscriptMessage } from '../store/slices/interviewsSlice';
import { updateFromWebSocket } from '../store/slices/avatarSlice';
import { addNotification } from '../store/slices/uiSlice';

// WebSocket message types
export interface WebSocketMessage {
  type: 'transcript' | 'interview_status' | 'avatar_state' | 'system_notification' | 'interview_invite' | 'candidate_response' | 'join_session' | 'leave_session' | 'candidate_answer' | 'avatar_animation' | 'avatar_expression' | 'start_interview' | 'end_interview' | 'auth' | 'heartbeat';
  payload: any;
  timestamp: string;
  sessionId?: string;
  userId?: string;
}

// WebSocket connection states
export enum WebSocketState {
  CONNECTING = 'CONNECTING',
  OPEN = 'OPEN',
  CLOSING = 'CLOSING',
  CLOSED = 'CLOSED',
  ERROR = 'ERROR',
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private heartbeatInterval: number | null = null;
  private messageQueue: WebSocketMessage[] = [];
  private isConnecting = false;

  constructor() {
    this.connect();
  }

  private connect(): void {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.isConnecting = true;
    const wsUrl = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3004/ws';
    
    try {
      this.ws = new WebSocket(wsUrl);
      this.setupEventListeners();
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.handleReconnect();
    }
  }

  private setupEventListeners(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      
      // Send queued messages
      this.flushMessageQueue();
      
      // Send authentication
      this.authenticate();
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      this.isConnecting = false;
      this.stopHeartbeat();
      
      if (!event.wasClean) {
        this.handleReconnect();
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.isConnecting = false;
      this.handleReconnect();
    };
  }

  private handleMessage(message: WebSocketMessage): void {
    const state = store.getState();
    
    switch (message.type) {
      case 'interview_status':
        if (message.sessionId) {
          store.dispatch(updateSessionStatus({
            sessionId: message.sessionId,
            status: message.payload.status,
          }));
        }
        break;

      case 'avatar_state':
        store.dispatch(updateFromWebSocket({
          type: message.payload.stateType,
          value: message.payload.value,
        }));
        break;

      case 'transcript':
        if (message.sessionId && message.payload) {
          store.dispatch(addTranscriptMessage({
            sessionId: message.sessionId,
            speaker: message.payload.speaker,
            text: message.payload.text,
          }));
        }
        break;

      case 'system_notification':
        store.dispatch(addNotification({
          type: message.payload.type || 'info',
          title: message.payload.title || 'System Notification',
          message: message.payload.message,
        }));
        break;

      case 'interview_invite':
        store.dispatch(addNotification({
          type: 'info',
          title: 'Interview Invitation',
          message: `You have been invited to an interview: ${message.payload.jobTitle}`,
        }));
        break;

      case 'candidate_response':
        // Handle real-time candidate responses during interviews
        if (message.sessionId) {
          store.dispatch(addTranscriptMessage({
            sessionId: message.sessionId,
            speaker: 'candidate',
            text: message.payload.response,
          }));
        }
        break;

      default:
        console.warn('Unknown WebSocket message type:', message.type);
    }
  }

  private authenticate(): void {
    const token = localStorage.getItem('authToken');
    if (token && this.ws) {
      this.sendMessage({
        type: 'auth',
        payload: { token },
        timestamp: new Date().toISOString(),
      });
    }
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.sendMessage({
          type: 'heartbeat',
          payload: {},
          timestamp: new Date().toISOString(),
        });
      }
    }, 30000); // Send heartbeat every 30 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
      store.dispatch(addNotification({
        type: 'error',
        title: 'Connection Lost',
        message: 'Unable to establish real-time connection. Some features may be limited.',
      }));
    }
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = this.messageQueue.shift();
      if (message) {
        this.sendRawMessage(message);
      }
    }
  }

  private sendMessage(message: WebSocketMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.sendRawMessage(message);
    } else {
      // Queue message for when connection is restored
      this.messageQueue.push(message);
    }
  }

  private sendRawMessage(message: WebSocketMessage): void {
    if (this.ws) {
      this.ws.send(JSON.stringify(message));
    }
  }

  // Public methods
  public joinInterviewSession(sessionId: string): void {
    this.sendMessage({
      type: 'join_session',
      payload: { sessionId },
      timestamp: new Date().toISOString(),
      sessionId,
    });
  }

  public leaveInterviewSession(sessionId: string): void {
    this.sendMessage({
      type: 'leave_session',
      payload: { sessionId },
      timestamp: new Date().toISOString(),
      sessionId,
    });
  }

  public sendInterviewAnswer(sessionId: string, answer: string): void {
    this.sendMessage({
      type: 'candidate_answer',
      payload: { answer },
      timestamp: new Date().toISOString(),
      sessionId,
    });
  }

  public requestAvatarAnimation(animation: string, parameters?: any): void {
    this.sendMessage({
      type: 'avatar_animation',
      payload: { animation, parameters },
      timestamp: new Date().toISOString(),
    });
  }

  public setAvatarExpression(expression: string): void {
    this.sendMessage({
      type: 'avatar_expression',
      payload: { expression },
      timestamp: new Date().toISOString(),
    });
  }

  public startInterview(sessionId: string): void {
    this.sendMessage({
      type: 'start_interview',
      payload: {},
      timestamp: new Date().toISOString(),
      sessionId,
    });
  }

  public endInterview(sessionId: string): void {
    this.sendMessage({
      type: 'end_interview',
      payload: {},
      timestamp: new Date().toISOString(),
      sessionId,
    });
  }

  public getConnectionState(): WebSocketState {
    if (!this.ws) return WebSocketState.CLOSED;
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return WebSocketState.CONNECTING;
      case WebSocket.OPEN:
        return WebSocketState.OPEN;
      case WebSocket.CLOSING:
        return WebSocketState.CLOSING;
      case WebSocket.CLOSED:
        return WebSocketState.CLOSED;
      default:
        return WebSocketState.ERROR;
    }
  }

  public isConnected(): boolean {
    return this.getConnectionState() === WebSocketState.OPEN;
  }

  public disconnect(): void {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public reconnect(): void {
    this.disconnect();
    this.reconnectAttempts = 0;
    this.connect();
  }
}

// Create singleton instance
export const websocketService = new WebSocketService();

// Hook for using WebSocket service
export const useWebSocket = () => {
  return {
    joinInterviewSession: websocketService.joinInterviewSession.bind(websocketService),
    leaveInterviewSession: websocketService.leaveInterviewSession.bind(websocketService),
    sendInterviewAnswer: websocketService.sendInterviewAnswer.bind(websocketService),
    requestAvatarAnimation: websocketService.requestAvatarAnimation.bind(websocketService),
    setAvatarExpression: websocketService.setAvatarExpression.bind(websocketService),
    startInterview: websocketService.startInterview.bind(websocketService),
    endInterview: websocketService.endInterview.bind(websocketService),
    getConnectionState: websocketService.getConnectionState.bind(websocketService),
    isConnected: websocketService.isConnected.bind(websocketService),
    reconnect: websocketService.reconnect.bind(websocketService),
  };
};
