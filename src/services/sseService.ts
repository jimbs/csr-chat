export class SSEService {
  private eventSource: EventSource | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000; // 3 seconds
  private listeners: { [key: string]: ((data: any) => void)[] } = {};
  private url: string;

  constructor(baseUrl: string) {
    this.url = baseUrl;
  }

  connect() {
    if (this.eventSource) {
      this.disconnect();
    }

    try {
      this.eventSource = new EventSource(this.url);

      this.eventSource.onopen = () => {
        console.log('SSE Connection established');
        this.reconnectAttempts = 0;
      };

      this.eventSource.onerror = (error) => {
        console.error('SSE Connection error:', error);
        this.handleError();
      };

      // Setup default message handler
      this.eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.notifyListeners('message', data);
      };

    } catch (error) {
      console.error('Failed to create SSE connection:', error);
      this.handleError();
    }
  }

  private handleError() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), this.reconnectDelay);
    } else {
      console.error('Max reconnection attempts reached');
      this.disconnect();
    }
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.listeners = {};
  }

  addEventListener(eventName: string, callback: (data: any) => void) {
    if (!this.eventSource) {
      throw new Error('SSE connection not established');
    }

    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
      
      this.eventSource.addEventListener(eventName, (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        this.notifyListeners(eventName, data);
      });
    }

    this.listeners[eventName].push(callback);
  }

  removeEventListener(eventName: string, callback: (data: any) => void) {
    if (this.listeners[eventName]) {
      this.listeners[eventName] = this.listeners[eventName].filter(
        (cb) => cb !== callback
      );
    }
  }

  private notifyListeners(eventName: string, data: any) {
    if (this.listeners[eventName]) {
      this.listeners[eventName].forEach((callback) => callback(data));
    }
  }
}

// Usage example:
/*
const sseService = new SSEService('https://api.example.com/events');

// Connect to the SSE endpoint
sseService.connect();

// Add event listeners
sseService.addEventListener('userMessage', (data) => {
  console.log('New message received:', data);
});

// Remove listeners when component unmounts
sseService.removeEventListener('userMessage', callback);

// Disconnect when done
sseService.disconnect();
*/