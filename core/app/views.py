from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from app.forms import CadastroUsuarioForm, GastoForm
from app.models import Gasto
from django.contrib.auth.decorators import login_required
from django.db.models import Sum
from django.utils import timezone
from django.utils.formats import date_format



def index(request):
   return render(request, "index.html")


def cadastro(request):
    form = CadastroUsuarioForm()
    
    if request.method == 'POST':
        dados = request.POST.dict()
        form = CadastroUsuarioForm(request.POST)
        print(dados)
        if form.is_valid():
            form.save()
            messages.success(request, "Conta criada com sucesso!")
            
            return redirect('login')
    
    
    return render(
        request, 
        "cadastro.html", 
        {
            'form':form
        }
    
    )


def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(
            request,
            username=username,
            password=password
        )

        if user is not None:
            login(request, user)
            messages.success(request, "Login realizado com sucesso.")
            return redirect("dashboard")
        else:
            messages.error(request, "Usuário ou senha inválidos.")

    return render(request, "login.html")

@login_required
def novo_gasto(request, gasto_id=None):
    
    if gasto_id:
        gasto = get_object_or_404(
            Gasto, 
            id=gasto_id,
            usuario=request.user
        )
    else:
        gasto = None
        
    if request.method == "POST":
        form = GastoForm(request.POST, instance=gasto)
        if form.is_valid():
            gasto_salvo = form.save(commit=False)
            gasto_salvo.usuario = request.user
            gasto_salvo.save()
            return redirect("dashboard")
    
    else:
        form = GastoForm(instance=gasto)
    
    return render(
        request, 
        "gasto_form.html",
        {
            'form': form,
            'gasto': gasto
        }
        )


@login_required
def dashboard(request):
    hoje = timezone.now().date()
    nome_mes = date_format(hoje, "F")
    ano_atual = hoje.year

    gastos = Gasto.objects.filter(usuario=request.user)

    total_mes = gastos.filter(
        data__month=hoje.month,
        data__year=hoje.year
    ).aggregate(total=Sum("valor"))["total"] or 0

    return render(
        request,
        "dashboard.html",
        {
            'gastos': gastos,
            'mes_atual': nome_mes,
            'ano_atual': ano_atual,
            'total_mes': total_mes
        }
    )



def logout_view(request):
    logout(request)
    return redirect("index")


@login_required
def excluir_gasto(request, id):
    gasto = get_object_or_404(
        Gasto,
        id=id,
        usuario=request.user
    )
    
    if request.method == "POST":
        gasto.delete()
        return redirect('dashboard')

    else:
        return redirect ('dashboard')