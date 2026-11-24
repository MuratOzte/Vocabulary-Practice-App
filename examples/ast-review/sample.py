from functools import lru_cache


class ReportService:
    @lru_cache(maxsize=16)
    def render(self, title: str = "İstanbul") -> str:
        def format_title() -> str:
            return f"Report: {title}"

        return format_title()

    def preview(self, title: str = "İstanbul") -> str:
        return f"Preview: {title}"
