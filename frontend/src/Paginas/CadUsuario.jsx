//formas para fazer a validação de um formulário usando o REACT
//zod, trabalha com mais componentes para fazer sentido na sua valaidação
//Os triamigos são "zod" "useForm", //resolvers (mãezona)
import { useForm } from "react-hook-form";
import { set, z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
//zod campo a campo o que eu valido, e ql a mensagem que eu exibo , se der um erro

const schemaCadUsuario = z.object({
    username: z.string()
        .min(1, 'Preencha o campo username, por favor')
        .max(100, 'O campo permite até 100 caracteres')
        .regex(/^[A-Za-zÀ-ú ]+$/, 'O campo username só aceita letras e espaços')
        .refine((str) => str.trim().length > 0, {
            message: "Preencha o campo usuario",
        }),
    email: z.string()
        .min(1, 'Preencha o campo email, por favor')
        .max(50, 'O campo permite até 50 caracteres')
        .email('Insira um email válido')
        .refine((str) => str.trim().length > 0, {
            message: "Preencha o campo email",
        }),
});

// Crianção do componente
export function CadUsuario() {
    // 
    const {
        register,//registra para mim 
        handleSubmit,// no momento em que eu submeter(clicar em cadastrar)
        formState: { errors }, //o que ta no formulario // se der ruim deixa na variavel errors
        setValue,
        reset // PERGUNTAR AQUI <----------------------------------------------------------
    } = useForm({ resolver: zodResolver(schemaCadUsuario) });//mamae junta os 3 e faz a validação

    async function obterDados(data) {

        //chamada a API 
        try {
            await axios.post('http://127.0.0.1:8000/user/', data);
            alert("Usuário cadastrado com sucesso!!");

            reset();
            // se der problema mostro uma mensagem de erro
        } catch (error) {
            if (error.request.response === "{\"email\":[\"user with this email already exists.\"]}") {
                alert("E-mail já cadastrado!");
                return
            }
            console.error("Deu ruim hein", error)
        }

    }
    return (
        //no momento da submissao chamo as funções 
        <form className="formulario" onSubmit={handleSubmit(obterDados)}>
            <h2>Cadastro de Usuário</h2>
            <label>Username:</label>
            {/* o register pega o valor inserido num campo input */}
            <input
                type="text"
                placeholder="Digite o nome..."
                {...register('username')}
                onBlur={(e) => setValue("username", e.target.value.trim())}
            />
            {/* Se der erro eu crio um novo paragrafo para exibir a mensagem */}
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