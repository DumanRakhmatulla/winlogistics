from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db import transaction
from django.contrib.admin.views.decorators import staff_member_required
from django.http import HttpResponseRedirect
from django.urls import reverse

from .models import TrackingCode, UserTrackingCode
from .forms import SearchTrackingForm, BulkTrackingUpdateForm

def tracking_home(request):
    form = SearchTrackingForm()
    return render(request, 'tracking/index.html', {'form': form})

def search_tracking(request):
    if request.method == 'POST':
        form = SearchTrackingForm(request.POST)
        if form.is_valid():
            code = form.cleaned_data['tracking_code']
            try:
                tracking_obj = TrackingCode.objects.get(code=code)
                return redirect('tracking_detail', code=code)
            except TrackingCode.DoesNotExist:
                messages.error(request, 'Трек-код не найден в системе')
                return render(request, 'tracking/search.html', {'form': form})
    else:
        form = SearchTrackingForm()
    
    return render(request, 'tracking/search.html', {'form': form})

def tracking_detail(request, code):
    tracking_obj = get_object_or_404(TrackingCode, code=code)
    user_has_tracking = False
    
    if request.user.is_authenticated:
        user_has_tracking = UserTrackingCode.objects.filter(
            user=request.user,
            tracking_code=tracking_obj
        ).exists()
    
    context = {
        'tracking': tracking_obj,
        'user_has_tracking': user_has_tracking
    }
    return render(request, 'tracking/tracking_detail.html', context)

@login_required
def add_to_profile(request, code):
    tracking_obj = get_object_or_404(TrackingCode, code=code)
    
    # Проверяем, не добавлен ли уже этот трек-код
    user_tracking, created = UserTrackingCode.objects.get_or_create(
        user=request.user,
        tracking_code=tracking_obj
    )
    
    if created:
        messages.success(request, 'Трек-код добавлен в ваш профиль')
    else:
        messages.info(request, 'Этот трек-код уже в вашем профиле')
    
    return redirect('tracking_detail', code=code)

@staff_member_required
def admin_panel(request):
    form = BulkTrackingUpdateForm()
    
    # Добавьте расчет статистики
    tracking_count = TrackingCode.objects.count()
    delivered_count = TrackingCode.objects.filter(status=5).count()
    in_transit_count = TrackingCode.objects.filter(status__in=[1, 2, 3, 4]).count()
    
    context = {
        'form': form,
        'tracking_count': tracking_count,
        'delivered_count': delivered_count,
        'in_transit_count': in_transit_count
    }
    
    return render(request, 'tracking/admin_panel.html', context)

@staff_member_required
def update_tracking_codes(request):
    if request.method == 'POST':
        form = BulkTrackingUpdateForm(request.POST)
        if form.is_valid():
            codes = form.cleaned_data['tracking_codes']
            status = form.cleaned_data['status']
            
            created_count = 0
            updated_count = 0
            
            with transaction.atomic():
                for code_value in codes:
                    # Попытка найти существующий трек-код
                    tracking_obj, created = TrackingCode.objects.get_or_create(
                        code=code_value,
                        defaults={'status': status}
                    )
                    
                    if created:
                        created_count += 1
                    else:
                        tracking_obj.status = status
                        tracking_obj.save()
                        updated_count += 1
            
            if created_count > 0:
                messages.success(request, f'Добавлено {created_count} новых трек-кодов')
            
            if updated_count > 0:
                messages.success(request, f'Обновлено {updated_count} существующих трек-кодов')
            
            return redirect('admin_panel')
    else:
        form = BulkTrackingUpdateForm()
    
    return render(request, 'tracking/admin_panel.html', {'form': form})