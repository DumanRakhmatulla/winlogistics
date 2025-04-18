from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .forms import UserRegisterForm
from tracking.models import UserTrackingCode

def register(request):
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'Аккаунт создан для {username}! Теперь вы можете войти.')
            return redirect('login')
    else:
        form = UserRegisterForm()
    return render(request, 'accounts/register.html', {'form': form})

@login_required
def profile(request):
    return render(request, 'accounts/profile.html')

@login_required
def my_items(request):
    # Получаем все трек-коды, добавленные пользователем
    user_tracking_codes = UserTrackingCode.objects.filter(user=request.user).select_related('tracking_code')
    
    # Подсчитываем статистику
    # Считаем доставленными товары со статусами 4 (Товар в Актобе) и 5 (Товар передан клиенту)
    delivered_count = user_tracking_codes.filter(tracking_code__status__in=['4', '5']).count()
    active_count = user_tracking_codes.count() - delivered_count
    
    context = {
        'user_tracking_codes': user_tracking_codes,
        'delivered_count': delivered_count,
        'active_count': active_count
    }
    return render(request, 'accounts/my_items.html', context)