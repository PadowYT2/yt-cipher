import { Counter, Gauge, Histogram, Registry } from 'prom-client';

export const registry = new Registry();

// Default buckets for http request duration
const httpBuckets = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10];

export const endpointHits = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests.',
    labelNames: ['method', 'pathname', 'player_id', 'player_type', 'plugin_version', 'user_agent'],
    registers: [registry],
});

export const responseCodes = new Counter({
    name: 'http_responses_total',
    help: 'Total number of HTTP responses.',
    labelNames: ['method', 'pathname', 'status', 'player_id', 'player_type', 'plugin_version', 'user_agent'],
    registers: [registry],
});

export const workerErrors = new Counter({
    name: 'worker_errors_total',
    help: 'Total number of worker errors.',
    labelNames: ['player_id', 'player_type', 'message'],
    registers: [registry],
});

export const endpointLatency = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration in seconds.',
    labelNames: ['method', 'pathname', 'player_id', 'player_type', 'cached'],
    buckets: httpBuckets,
    registers: [registry],
});

export const playerScriptOverwrites = new Counter({
    name: 'player_script_overwrites_total',
    help: 'Total number of player script overwrites, e.g. when forcing a specific player version.',
    labelNames: ['type', 'source', 'forced'],
    registers: [registry],
});

export const cacheSize = new Gauge({
    name: 'cache_size',
    help: 'The number of items in the cache.',
    labelNames: ['cache_name'],
    registers: [registry],
});

export const playerUrlRequests = new Counter({
    name: 'player_url_requests_total',
    help: 'Total number of requests for each player ID.',
    labelNames: ['player_id', 'player_type'],
    registers: [registry],
});

export const playerScriptFetches = new Counter({
    name: 'player_script_fetches_total',
    help: 'Total number of player script fetches.',
    labelNames: ['player_url', 'status'],
    registers: [registry],
});
