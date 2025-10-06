import { preprocessPlayer } from 'ejs/src/yt/solver/solvers';

self.onmessage = (e: MessageEvent<string>) => {
    try {
        const output = preprocessPlayer(e.data);
        self.postMessage({ type: 'success', data: output });
    } catch (error: any) {
        self.postMessage({
            type: 'error',
            data: {
                message: error.message,
                stack: error.stack,
            },
        });
    }
};
