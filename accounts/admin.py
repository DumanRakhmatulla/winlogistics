from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from tracking.models import UserTrackingCode

# Определяем инлайн для трек-кодов пользователя
class UserTrackingInline(admin.TabularInline):
    model = UserTrackingCode
    extra = 0
    fields = ('tracking_code', 'added_at')
    readonly_fields = ('added_at',)

# Расширяем стандартный UserAdmin
class CustomUserAdmin(UserAdmin):
    inlines = [UserTrackingInline]
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active', 'date_joined', 'tracking_count')
    
    def tracking_count(self, obj):
        return obj.tracking_codes.count()
    tracking_count.short_description = 'Трек-коды'

# Перерегистрируем User с нашим кастомным админ-классом
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)