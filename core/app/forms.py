from django.contrib.auth.forms import UserCreationForm
from django.forms import ModelForm
from .models import User, Gasto


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


class GastoForm(ModelForm):
    class Meta:
        model = Gasto
        fields = ['descricao', 'valor', 'data']