from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        custom_response = {
            "error": True,
            "message": "An error occurred",
            "details": response.data,
            "status_code": response.status_code,
        }

        if isinstance(response.data, dict):
            if "detail" in response.data:
                custom_response["message"] = str(response.data["detail"])
            elif "non_field_errors" in response.data:
                custom_response["message"] = str(response.data["non_field_errors"][0])
            else:
                custom_response["message"] = "Validation error"

        response.data = custom_response
        logger.error(f"API Error: {custom_response}")
    else:
        logger.exception(f"Unhandled exception: {exc}")
        response = Response(
            {"error": True, "message": "Internal server error", "status_code": 500},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return response