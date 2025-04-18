from django.db import models
from django.contrib.auth.models import User

class TrackingStatus(models.TextChoices):
    WAREHOUSE = '1', 'Товар попал в склад'
    DISPATCHED = '2', 'Товар отправился'
    ALMATY = '3', 'Товар в алмате'
    AKTOBE = '4', 'Товар в актобе'
    DELIVERED = '5', 'Товар передан клиенту'

class TrackingCode(models.Model):
    code = models.CharField(max_length=100, unique=True, verbose_name='Трек-код')
    status = models.CharField(
        max_length=1,
        choices=TrackingStatus.choices,
        default=TrackingStatus.WAREHOUSE,
        verbose_name='Статус'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')
    
    def __str__(self):
        return f"{self.code} - {self.get_status_display()}"
    
    class Meta:
        verbose_name = 'Трек-код'
        verbose_name_plural = 'Трек-коды'

class UserTrackingCode(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tracking_codes')
    tracking_code = models.ForeignKey(TrackingCode, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'tracking_code')
        verbose_name = 'Трек-код пользователя'
        verbose_name_plural = 'Трек-коды пользователей'
    
    def __str__(self):
        return f"{self.user.username} - {self.tracking_code.code}"