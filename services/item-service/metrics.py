import time
from collections import defaultdict


class MetricsCollector:
    def __init__(self):
        self.start_time = time.time()
        self.total_requests = 0
        self.total_errors = 0
        self.status_codes = defaultdict(int)
        self.latencies = []
        self.endpoint_stats = defaultdict(
            lambda: {
                "count": 0,
                "errors": 0,
                "total_latency": 0,
            }
        )

    def record_request(
        self,
        method: str,
        path: str,
        status_code: int,
        duration_ms: float,
    ):
        self.total_requests += 1

        if status_code >= 400:
            self.total_errors += 1

        self.status_codes[str(status_code)] += 1

        self.latencies.append(duration_ms)

        endpoint = f"{method} {path}"

        self.endpoint_stats[endpoint]["count"] += 1
        self.endpoint_stats[endpoint]["total_latency"] += duration_ms

        if status_code >= 400:
            self.endpoint_stats[endpoint]["errors"] += 1

    def percentile(self, data, p):
        if not data:
            return 0

        data = sorted(data)
        k = int((len(data) - 1) * p / 100)

        return round(data[k], 2)

    def get_metrics(self):
        uptime = round(time.time() - self.start_time, 2)

        avg_latency = (
            round(sum(self.latencies) / len(self.latencies), 2)
            if self.latencies
            else 0
        )

        endpoints = {}

        for endpoint, stats in self.endpoint_stats.items():
            endpoints[endpoint] = {
                "count": stats["count"],
                "errors": stats["errors"],
                "avg_latency_ms": round(
                    stats["total_latency"] / stats["count"],
                    2,
                ),
            }

        return {
            "uptime_seconds": uptime,
            "total_requests": self.total_requests,
            "total_errors": self.total_errors,
            "error_rate_percent": round(
                (self.total_errors / self.total_requests) * 100,
                2,
            )
            if self.total_requests
            else 0,
            "status_codes": dict(self.status_codes),
            "latency": {
                "p50_ms": self.percentile(self.latencies, 50),
                "p95_ms": self.percentile(self.latencies, 95),
                "p99_ms": self.percentile(self.latencies, 99),
                "avg_ms": avg_latency,
            },
            "endpoints": endpoints,
        }


metrics = MetricsCollector()