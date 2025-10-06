// Diferentes jeitos de validar formulários em React
// O Zod é útil porque permite estruturar validações de forma detalhada
// A combinação mais comum é usar: "zod", "useForm" e o "resolver" (faz a ponte entre eles)
import { useForm } from "react-hook-form";
import { set, z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
// No zod definimos cada regra de validação e a mensagem de erro exibida quando algo não estiver certo

const schemaCadUsuario = z.object({
    username: z.string()
        .min(1, 'O campo username é obrigatório')
        .max(100, 'Máximo de 100 caracteres permitidos')
        .regex(/^[A-Za-zÀ-ú ]+$/, 'Somente letras e espaços são aceitos')
        .refine((str) => str.trim().length > 0, {
            message: "O campo usuário não pode ficar vazio",
        }),
    email: z.string()
        .min(1, 'O campo email é obrigatório')
        .max(50, 'O email pode ter até 50 caracteres')
        .email('Digite um email válido')
        .refine((str) => str.trim().length > 0, {
            message: "O campo email não pode ficar em branco",
        }),
});

// Definição do componente
export function CadUsuario() {
    // Desestruturando funções do useForm
    const {
        register, // conecta o input ao hook
        handleSubmit, // executa quando o formulário é enviado
        formState: { errors }, // contém os erros gerados durante a validação
        setValue, // permite ajustar valores manualmente
        reset // usado para limpar o formulário após o envio
    } = useForm({ resolver: zodResolver(schemaCadUsuario) }); // aqui juntamos zod + react-hook-form

    async function obterDados(data) {
        // Faz a requisição para a API
        try {
            await axios.post('http://127.0.0.1:8000/user/', data);
            alert("Usuário cadastrado com sucesso!");
            reset(); // limpa os campos depois do sucesso
        } catch (error) {
            // caso o email já esteja cadastrado, tratamos essa situação
            if (error.request.response === "{\"email\":[\"user with this email already exists.\"]}") {
                alert("E-mail já registrado!");
                return
            }
            console.error("Erro durante o cadastro:", error)
        }
    }

    return (
        // Ao enviar o formulário, a função handleSubmit chama obterDados
        <form className="formulario" onSubmit={handleSubmit(obterDados)}>
            <h2>Cadastro de Usuário</h2>
            <label>Username:</label>
            {/* register captura o valor digitado no input */}
            <input
                type="text"
                placeholder="Digite o nome..."
                {...register('username')}
                onBlur={(e) => setValue("username", e.target.value.trim())}
            />
            {/* Caso exista erro de validação, exibimos a mensagem aqui */}
            {errors.username && <p>{errors.username.message}</p>}

            <label>E-mail:</label>
            <input
                type='email'
                placeholder="email@dominio.com.br"
                {...register('email')}
                onBlur={(e) => setValue("email", e.target.value.trim())}
            />
            {errors.email && <p>{errors.email.message}</p>}

            <button type="submit">Cadastrar</button>
        </form>
    )
}
