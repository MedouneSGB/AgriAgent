from agents.orchestrator import orchestrate


async def handle_incoming_sms(from_number: str, body: str) -> dict:
    """Process an incoming SMS and return a response."""
    message = body.strip()

    # Detect language and command from SMS
    command, args = parse_sms_command(message)

    # Route through orchestrator
    result = await orchestrate(
        message=message,
        city=args.get("city"),
        language=args.get("language"),
        session_id=from_number,
        channel="sms",
    )

    # Truncate for SMS (160 char limit per segment)
    sms_response = truncate_for_sms(result["response"])

    return {
        "to": from_number,
        "message": sms_response,
        "language": result["language"],
        "agents_used": result["agents_used"],
    }


def parse_sms_command(message: str) -> tuple[str, dict]:
    """Parse SMS message into command and arguments.

    Supported commands:
      METEO <city>     - Weather forecast
      JEGGE <crop>     - Disease diagnosis
      NJEG <crop>      - Market price
      TOOL <crop>      - Crop advice
      NDIMBAL          - Help
    """
    parts = message.upper().split(maxsplit=1)
    command = parts[0] if parts else ""
    arg = parts[1].strip() if len(parts) > 1 else ""

    # Wolof commands
    wolof_commands = {"METEO", "JEGGE", "NJEG", "TOOL", "NDIMBAL"}
    # French equivalents
    french_commands = {"METEO": "METEO", "MALADIE": "JEGGE", "PRIX": "NJEG", "CULTURE": "TOOL", "AIDE": "NDIMBAL"}

    if command in french_commands:
        command = french_commands[command]

    is_wolof = command in wolof_commands
    language = "wo" if is_wolof else "fr"

    args = {"language": language}

    if command == "METEO":
        args["city"] = arg.lower() if arg else "dakar"
    elif command in ("JEGGE", "NJEG", "TOOL"):
        args["crop"] = arg.lower() if arg else None
    elif command == "NDIMBAL":
        pass

    return command, args


def truncate_for_sms(text: str, max_length: int = 320) -> str:
    """Truncate text for SMS. Allow 2 segments (320 chars) for rich content."""
    if len(text) <= max_length:
        return text
    return text[:max_length - 3] + "..."
