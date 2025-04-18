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
    
    context = {
        'user_tracking_codes': user_tracking_codes
    }
    return render(request, 'accounts/my_items.html', context)