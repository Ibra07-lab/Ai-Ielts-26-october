"""
IELTS Reading MCP Server for OpenAI Integration

This MCP server exposes IELTS Reading data retrieval tools that OpenAI can call
to generate personalized, evidence-based feedback for students.

Usage:
    python mcp_server.py

Tools exposed:
    - get_passage: Retrieve a reading passage from a test
    - get_question: Get specific question details
    - get_correct_answer: Get the correct answer for a question
    - get_student_answer: Get student's submitted answer
    - get_error_profile: Get user's error patterns and accuracy
"""

import asyncio
import json
import logging
import sys
from typing import Any, Dict

# Correct imports based on actual MCP SDK structure (v1.12.4)
try:
    from mcp.server import Server
    from mcp import stdio_server
    from mcp.types import Tool, TextContent
except ImportError as e:
    print(
        f"Error: MCP SDK import failed: {e}\n"
        "Install with: pip install mcp>=1.0.0",
        file=sys.stderr
    )
    sys.exit(1)

from reading_mcp_tools import (
    get_passage,
    get_question,
    get_correct_answer,
    get_student_answer,
    get_error_profile,
    ReadingDataError,
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# Initialize MCP server
server = Server("ielts-reading")


@server.list_tools()
async def list_tools() -> list[Tool]:
    """
    List all available MCP tools.
    
    Returns:
        List of Tool objects describing available functions
    """
    return [
        Tool(
            name="get_passage",
            description=(
                "Retrieve a reading passage from a test. "
                "Returns passage text, paragraphs, and all questions."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "test_id": {
                        "type": "integer",
                        "description": "The test number (1-16)",
                        "minimum": 1,
                        "maximum": 16
                    },
                    "passage_id": {
                        "type": "integer",
                        "description": "The passage number within test (1-3)",
                        "minimum": 1,
                        "maximum": 3
                    }
                },
                "required": ["test_id", "passage_id"]
            }
        ),
        Tool(
            name="get_question",
            description=(
                "Get specific question details including text, options, "
                "type, and instructions."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "test_id": {
                        "type": "integer",
                        "description": "The test number",
                        "minimum": 1
                    },
                    "passage_id": {
                        "type": "integer",
                        "description": "The passage number within test",
                        "minimum": 1,
                        "maximum": 3
                    },
                    "question_id": {
                        "type": "integer",
                        "description": "The question number",
                        "minimum": 1
                    }
                },
                "required": ["test_id", "passage_id", "question_id"]
            }
        ),
        Tool(
            name="get_correct_answer",
            description="Get the correct answer for a specific question.",
            inputSchema={
                "type": "object",
                "properties": {
                    "test_id": {
                        "type": "integer",
                        "description": "The test number",
                        "minimum": 1
                    },
                    "passage_id": {
                        "type": "integer",
                        "description": "The passage number",
                        "minimum": 1,
                        "maximum": 3
                    },
                    "question_id": {
                        "type": "integer",
                        "description": "The question number",
                        "minimum": 1
                    }
                },
                "required": ["test_id", "passage_id", "question_id"]
            }
        ),
        Tool(
            name="get_student_answer",
            description=(
                "Get student's most recent submitted answer for a question. "
                "Includes submission timestamp."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "integer",
                        "description": "The user ID",
                        "minimum": 1
                    },
                    "test_id": {
                        "type": "integer",
                        "description": "The test number",
                        "minimum": 1
                    },
                    "passage_id": {
                        "type": "integer",
                        "description": "The passage number",
                        "minimum": 1,
                        "maximum": 3
                    },
                    "question_id": {
                        "type": "integer",
                        "description": "The question number",
                        "minimum": 1
                    }
                },
                "required": ["user_id", "test_id", "passage_id", "question_id"]
            }
        ),
        Tool(
            name="get_error_profile",
            description=(
                "Get user's error patterns and overall accuracy statistics "
                "based on their reading session history."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "integer",
                        "description": "The user ID",
                        "minimum": 1
                    }
                },
                "required": ["user_id"]
            }
        )
    ]


@server.call_tool()
async def call_tool(name: str, arguments: Dict[str, Any]) -> list[TextContent]:
    """
    Handle tool invocation requests from OpenAI.
    
    Args:
        name: The tool name to call
        arguments: Dictionary of arguments for the tool
        
    Returns:
        List of TextContent with JSON-serialized results
        
    Raises:
        ValueError: If tool name is unknown
        ReadingDataError: If data retrieval fails
    """
    logger.info(f"Tool called: {name} with arguments: {arguments}")
    
    try:
        if name == "get_passage":
            result = await get_passage(
                test_id=arguments["test_id"],
                passage_id=arguments["passage_id"]
            )
        elif name == "get_question":
            result = await get_question(
                test_id=arguments["test_id"],
                passage_id=arguments["passage_id"],
                question_id=arguments["question_id"]
            )
        elif name == "get_correct_answer":
            result = await get_correct_answer(
                test_id=arguments["test_id"],
                passage_id=arguments["passage_id"],
                question_id=arguments["question_id"]
            )
        elif name == "get_student_answer":
            result = await get_student_answer(
                user_id=arguments["user_id"],
                test_id=arguments["test_id"],
                passage_id=arguments["passage_id"],
                question_id=arguments["question_id"]
            )
        elif name == "get_error_profile":
            result = await get_error_profile(
                user_id=arguments["user_id"]
            )
        else:
            raise ValueError(f"Unknown tool: {name}")
        
        logger.info(f"Tool {name} executed successfully")
        
        # Return result as JSON-serialized TextContent
        import json
        return [TextContent(
            type="text",
            text=json.dumps(result, indent=2)
        )]
        
    except ReadingDataError as e:
        logger.error(f"Data error in tool {name}: {str(e)}")
        return [TextContent(
            type="text",
            text=json.dumps({"error": str(e), "tool": name})
        )]
    except Exception as e:
        logger.error(f"Unexpected error in tool {name}: {str(e)}", exc_info=True)
        return [TextContent(
            type="text",
            text=json.dumps({"error": f"Internal error: {str(e)}", "tool": name})
        )]


async def main():
    """
    Main entry point - runs the MCP server via stdio.
    """
    logger.info("Starting IELTS Reading MCP Server...")
    
    try:
        # Run the server via stdio transport (for OpenAI integration)
        async with stdio_server() as (read_stream, write_stream):
            await server.run(
                read_stream,
                write_stream,
                server.create_initialization_options()
            )
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
    except Exception as e:
        logger.error(f"Server error: {str(e)}", exc_info=True)
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())

