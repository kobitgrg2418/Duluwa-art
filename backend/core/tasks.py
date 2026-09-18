from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
import logging

logger = logging.getLogger(__name__)


@shared_task
def send_payment_confirmation(order_id):
    from orders.models import Order
    try:
        order = Order.objects.select_related("user").prefetch_related("items__artwork").get(id=order_id)
    except Order.DoesNotExist:
        logger.error(f"Order {order_id} not found for payment confirmation")
        return

    subject = f"Payment Confirmation - Order {order.id}"
    message = render_to_string("emails/payment_confirmation.txt", {"order": order})
    html_message = render_to_string("emails/payment_confirmation.html", {"order": order})

    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [order.email],
            html_message=html_message,
            fail_silently=False,
        )
        logger.info(f"Payment confirmation sent for order {order.id}")
    except Exception as e:
        logger.error(f"Failed to send payment confirmation for order {order.id}: {e}")