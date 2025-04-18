from django.contrib import admin
from .models import TrackingCode, UserTrackingCode

@admin.register(TrackingCode)
class TrackingCodeAdmin(admin.ModelAdmin):
    list_display = ('code', 'get_status_display', 'created_at', 'updated_at')
    list_filter = ('status', 'created_at', 'updated_at')
    search_fields = ('code',)
    date_hierarchy = 'created_at'
    
    def get_status_display(self, obj):
        return obj.get_status_display()
    get_status_display.short_description = 'Статус'

@admin.register(UserTrackingCode)
class UserTrackingCodeAdmin(admin.ModelAdmin):
    list_display = ('user', 'tracking_code', 'added_at')
    list_filter = ('added_at',)
    search_fields = ('user__username', 'tracking_code__code')
    date_hierarchy = 'added_at'
    raw_id_fields = ('user', 'tracking_code')