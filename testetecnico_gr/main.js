document.getElementById("btnCadastrar").addEventListener("click", (event) => {
    event.preventDefault();

    //Para as validações, coloquei esse booleano para retornar os válidos e inválidos
    let valid = true;


    let nome = document.getElementById("nome").value.trim();
    let email = document.getElementById("email").value.trim();
    let cpf = document.getElementById("cpf").value.trim();
    let dataNascimento = document.getElementById("dataNascimento").value.trim();
    let cep = document.getElementById("cep").value.trim();
    let logradouro = document.getElementById("logradouro").value.trim();
    let bairro = document.getElementById("bairro").value.trim();
    let cidade = document.getElementById("cidade").value.trim();
    let estado = document.getElementById("estado").value.trim();


    // Validações 
    if (!validarNome(nome)) {
        mostrarErro("nome");
        valid = false;
    } else {
        ocultarErro("nome");
    }

    //Usei um REGEX para a verificação do email para simplificar o código
    if (email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        mostrarErro("email");
        valid = false;
    } else {
        ocultarErro("email");
    }

    if (!validarCPF(cpf)) {
        mostrarErro("cpf");
        valid = false;
    } else {
        ocultarErro("cpf");
    }

    if (!validarCEP(cep)) {
        mostrarErro("cep");
        valid = false;
    } else {
        ocultarErro("cep");
    }


    if (!validarData(dataNascimento)) {
        mostrarErro("dataNascimento");
        valid = false;
    } else {
        ocultarErro("dataNascimento");
    }
    // Fim das validações

    //Se estiver válido eu retorno os dados para serem colocados na tabela
    if (!valid) return;

    function calcularIdade(dataNascimento) {
        const hoje = new Date();
        const dataAniversario = new Date(dataNascimento);
        let idade = hoje.getFullYear() - dataAniversario.getFullYear();
        const verificacaoAniversario = hoje.getMonth() - dataAniversario.getMonth();

        //O nome da variavel verificacaoAniversario, se da para eu verificar se a pessoa ja fez aniversário ou não
        if (verificacaoAniversario < 0 || (verificacaoAniversario === 0 && hoje.getDate() < dataAniversario.getDate())) {
            idade--;
        }

        return idade;
    }

    let tabela = document.getElementById("tabela");
    let linha = tabela.insertRow();

    let idade = calcularIdade(dataNascimento);


    linha.innerHTML =
        ` <td>${nome}</td>
      <td>${email}</td>
      <td>${idade}</td> 
      <td>${cpf}</td> 
      <td>${cep}</td> 
      <td>${logradouro}</td> 
      <td>${bairro}</td>
      <td>${cidade}</td>  
      <td>${estado}</td> 
        `


    limparCampos();

})

//Limpando campos após serem inseridos na tabela
function limparCampos() {
    document.getElementById("nome").value = "";
    document.getElementById("email").value = "";
    document.getElementById("cpf").value = "";
    document.getElementById("dataNascimento").value = "";
    document.getElementById("cep").value = "";
    document.getElementById("logradouro").value = "";
    document.getElementById("bairro").value = "";
    document.getElementById("cidade").value = "";
    document.getElementById("estado").value = "";


    document.getElementById("nome").focus();
}
// Nesta função estou usando uma técnica chamada spread que coloca os valores em uma array e verifico cada um eles para ter as condições que coloquei ali

function validarNome(nome) {
    if (nome.length < 1 || nome.length > 150 || [...nome].some(n => !isNaN(n) && n !== " ")) {
        mostrarErro("nome");
        return false;
    } else {
        ocultarErro("nome");
        return true;
    }
}

function validarCEP(cep) {
    if (cep.length !== 9) {
        mostrarErro("cep");
        return false;
    } else {
        ocultarErro("cep");
        return true;
    }

}

// Funções que mostram os elementos e mensagens que indicam erro
function mostrarErro(id) {
    document.querySelector(`#${id} + .span-required`).style.display = "block";
    document.getElementById(id).classList.add("input-erro");

}

function ocultarErro(id) {
    document.querySelector(`#${id} + .span-required`).style.display = "none";
    document.getElementById(id).classList.remove("input-erro");
}

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf[10]);
}



//Essa validação estou verificando se a data não está no passado (Se estiver será invalidada)
function validarData(dataNascimento) {
    let data = new Date(dataNascimento);
    let hoje = new Date();
    return data instanceof Date && !isNaN(data) && data < hoje;
}

function BuscarCep(cep) {
    document.getElementById("cep").addEventListener("blur", function () {
        let cep = this.value.replace(/\D/g, "");



        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    document.getElementById("logradouro").value = data.logradouro;
                    document.getElementById("bairro").value = data.bairro;
                    document.getElementById("cidade").value = data.localidade;
                    document.getElementById("estado").value = data.uf;
                } else {
                    alert("CEP não encontrado! Verifique e tente novamente.");
                    limparEndereco();
                }
            })
            .catch(error => {
                //Esse é caso dê erro de conexão ou algo parecido
                console.error("Erro ao buscar CEP:", error);
                alert("Erro ao consultar o CEP. Tente novamente mais tarde.");
                limparEndereco();
            })
    })
}

function limparEndereco() {
    document.getElementById("logradouro").value = "";
    document.getElementById("bairro").value = "";
    document.getElementById("cidade").value = "";
    document.getElementById("estado").value = "";

}

BuscarCep();
