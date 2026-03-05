"""
Module 03 - Communication Intelligence System (MCP PoC)

Transforma comunicaciones organizacionales (Slack, Zoom, Email)
en JSON estructurado para integrar con HubSpot CRM.

Esto es un PoC para validar el patrón de dispatching MCP antes de
conectar un modelo de NLP real. La clasificación actual es heurística.
"""

import json
import logging
import re
import uuid
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from enum import Enum
from typing import Optional

REVIEW_THRESHOLD = 0.75
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("CommIntel")


class SourceType(str, Enum):
    SLACK = "slack"
    ZOOM = "zoom"
    EMAIL = "email"
    UNKNOWN = "unknown"


class RecordType(str, Enum):
    DECISION = "decision"
    ACTION_ITEM = "action_item"
    MEETING_SUMMARY = "meeting_summary"


@dataclass
class CommRecord:
    record_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    source_type: str = SourceType.UNKNOWN
    record_type: str = RecordType.MEETING_SUMMARY
    summary: str = ""
    action_items: list = field(default_factory=list)
    confidence_score: float = 0.0

    def to_json(self) -> str:
        return json.dumps(asdict(self), indent=2)


class MCPDispatcher:
    def classify_source(self, raw_text: str) -> SourceType:
        t = raw_text.lower()
        if "[slack]" in t:
            return SourceType.SLACK
        if "zoom" in t:
            return SourceType.ZOOM
        return SourceType.UNKNOWN

    def extract_entities(self, raw_text: str) -> dict:
        return {
            "participants": re.findall(r"@(\w[\w.]+)", raw_text),
            "decisions": re.findall(r"decided:\s*(.+)", raw_text, re.I)
        }

    def process(self, raw_text: str) -> CommRecord:
        record = CommRecord()
        record.source_type = self.classify_source(raw_text)
        entities = self.extract_entities(raw_text)

        # Score básico por cantidad de entidades — mejorar con NLP real en v2
        participants = len(entities.get("participants", []))
        decisions = len(entities.get("decisions", []))
        record.confidence_score = min(1.0, participants * 0.2 + decisions * 0.3)

        if record.confidence_score >= REVIEW_THRESHOLD:
            record.record_type = RecordType.DECISION
            logger.info(f"High-confidence record [{record.record_id[:8]}] queued for CRM")
        else:
            logger.info(f"Low-confidence record [{record.record_id[:8]}] pending review")

        return record


if __name__ == "__main__":
    dispatcher = MCPDispatcher()
    sample = "[Slack] @javier decided: migrate to n8n for all automation flows. @lucia to handle transition."
    result = dispatcher.process(sample)
    print(result.to_json())
