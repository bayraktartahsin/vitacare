"""A2A protocol — agent-to-agent messaging between personas."""
from .consent import ConsentGrid, can_share
from .messages import A2AMessage, A2AReply

__all__ = ["A2AMessage", "A2AReply", "ConsentGrid", "can_share"]
