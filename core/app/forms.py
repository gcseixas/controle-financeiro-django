from django.contrib.auth.forms import UserCreationForm
from django.forms import ModelForm
from .models import User, Gasto
from decimal import Decimal, InvalidOperation
from django import forms
from django.core.exceptions import ValidationError


class CadastroUsuarioForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['nome', 'email','password1', 'password2']

    def save(self, commit=True):
        user = super().save(commit=False)

        # username técnico (exemplo simples)
        user.username = user.email

        if commit:
            user.save()

        return user


class GastoForm(forms.ModelForm):
    # aceitar entrada com vírgula (texto) e normalizar depois
    valor = forms.CharField(
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'input',
            'placeholder': '0,00',
            'inputmode': 'decimal',
            'autocomplete': 'off'
        })
    )

    class Meta:
        model = Gasto
        fields = ['descricao', 'valor', 'data']
        # ...existing code...

    def clean_valor(self):
        value = self.cleaned_data.get('valor')
        if value in (None, ''):
            return None
        if isinstance(value, str):
            normalized = value.replace('.', '').replace(',', '.').strip()
            try:
                return Decimal(normalized)
            except (InvalidOperation, ValueError):
                raise ValidationError('Valor inválido.')
        raise ValidationError('Valor inválido.')
