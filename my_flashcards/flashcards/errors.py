from rest_framework.response import Response


class ErrorHandlingMixin:
    def handle_response(self, message, status):
        return Response(
            {"message": message},
            status=status
        )
