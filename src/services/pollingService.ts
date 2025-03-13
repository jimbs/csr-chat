export class PollingService {
  private timerId: NodeJS.Timeout | null = null;
  private interval: number;
  private isPolling: boolean = false;
  private onError: (error: Error) => void;
  private retryCount: number = 0;
  private maxRetries: number = 3;

  constructor(
    private fetchFn: () => Promise<any>,
    private onSuccess: (data: any) => void,
    interval: number = 3000,
    errorHandler?: (error: Error) => void
  ) {
    this.interval = interval;
    this.onError = errorHandler || ((error: Error) => console.error('Polling error:', error));
  }

  start() {
    if (this.isPolling) return;
    
    this.isPolling = true;
    this.poll();
  }

  private async poll() {
    if (!this.isPolling) return;

    try {
      const data = await this.fetchFn();
      this.retryCount = 0;
      this.onSuccess(data);
    } catch (error) {
      this.retryCount++;
      this.onError(error as Error);

      if (this.retryCount >= this.maxRetries) {
        this.stop();
        return;
      }
    }

    this.timerId = setTimeout(() => this.poll(), this.interval);
  }

  stop() {
    this.isPolling = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.retryCount = 0;
  }

  setInterval(newInterval: number) {
    this.interval = newInterval;
    if (this.isPolling) {
      this.stop();
      this.start();
    }
  }

  isActive(): boolean {
    return this.isPolling;
  }
}

// Usage example:
/*
const polling = new PollingService(
  // Fetch function
  async () => {
    const response = await fetch('https://api.example.com/data');
    return response.json();
  },
  // Success handler
  (data) => {
    console.log('Received data:', data);
  },
  // Optional: custom interval (default 3000ms)
  5000,
  // Optional: custom error handler
  (error) => {
    console.error('Custom error handler:', error);
  }
);

// Start polling
polling.start();

// Stop polling (e.g., when component unmounts)
polling.stop();

// Change interval
polling.setInterval(10000);
*/