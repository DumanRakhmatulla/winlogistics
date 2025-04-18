from django import forms
from .models import TrackingCode, TrackingStatus

class SearchTrackingForm(forms.Form):
    tracking_code = forms.CharField(
        max_length=100,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Введите трек-код'
        })
    )

class BulkTrackingUpdateForm(forms.Form):
    tracking_codes = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'placeholder': 'Введите трек-коды, по одному на строку',
            'rows': 10
        }),
        help_text='Введите трек-коды, по одному на строку'
    )
    
    status = forms.ChoiceField(
        choices=TrackingStatus.choices,
        widget=forms.Select(attrs={'class': 'form-select'}),
        help_text='Выберите статус для всех введенных трек-кодов'
    )
    
    def clean_tracking_codes(self):
        data = self.cleaned_data['tracking_codes']
        codes = [code.strip() for code in data.split('\n') if code.strip()]
        
        if not codes:
            raise forms.ValidationError('Пожалуйста, введите хотя бы один трек-код')
            
        return codes