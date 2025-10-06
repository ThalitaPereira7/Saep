// Importações necessárias
import { zodResolver } from "@hookform/resolvers/zod" // integra o zod com react-hook-form
import axios from "axios" // cliente HTTP para chamadas de API
import { useEffect, useState } from "react"; // hooks do React
import { useForm } from "react-hook-form" // biblioteca para manipulação de formulários
import { useParams, useNavigate } from "react-router-dom"; // hooks para rotas (params e navegação)
import z from "zod" // biblioteca de validação

// 🔹 Definição do schema de validação usando zod
const schemaCadTarefas = z.object({
    description: z.string()
        .min(1, 'Preencha o campo descrição')
        .max(100, 'O campo permite até 100 caracteres')
        .refine((str) => str.trim().length > 0, {
            message: "Preencha o campo descrição",
        }),
        
    department: z.string()
        .min(1, 'Preencha o campo departamento')
        .max(100, 'O campo permite até 100 caracteres')
        .regex(/^[A-Za-zÀ-ú ]+$/, 'O campo departamento só aceita letras e espaços')
        .refine((str) => str.trim().length > 0, {
            message: "Preencha o campo departamento",
        }),

    user: z.coerce.number().min(1, 'Selecione um usuário'), // transforma string em número

    priority: z.enum(['low', 'medium', 'high'], {
        errorMap: () => ({ message: 'Selecione uma prioridade' })
    })
});


export function CadTarefas() {
    // Captura o id da tarefa (se houver) e função para redirecionamento
    const { id } = useParams();
    const navigate = useNavigate();

    // Configuração do formulário com validação do zod
    const {
        register, // conecta os campos do form ao hook
        handleSubmit, // executa função quando o form é enviado
        reset, // limpa ou redefine valores do formulário
        setValue, // ajusta valor manualmente
        formState: { errors } // armazena os erros de validação
    } = useForm({ resolver: zodResolver(schemaCadTarefas) });

    const [users, setUsers] = useState([]); // lista de usuários para o select

    // 🔹 Buscar todos os usuários ao carregar o componente
    useEffect(() => {
        axios.get("http://localhost:8000/user/")
            .then(res => setUsers(res.data))
            .catch(err => console.error("Erro ao buscar usuários:", err));
    }, []);

    // 🔹 Se existir um ID (edição), buscar a tarefa e preencher o formulário
    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:8000/tasks/${id}`)
                .then(res => {
                    reset({
                        description: res.data.description,
                        department: res.data.department,
                        user: res.data.user,
                        priority: res.data.priority,
                    });
                })
                .catch(err => console.error("Erro ao carregar tarefa:", err));
        }
    }, [id, reset]);

    // 🔹 Função para salvar ou atualizar tarefa
    async function salvarTarefa(data) {
        try {
            if (id) {
                // Atualiza se já existe
                await axios.put(`http://localhost:8000/tasks/${id}`, data);
                alert("Tarefa atualizada com sucesso!");
            } else {
                // Cria nova tarefa
                await axios.post("http://localhost:8000/tasks/", data);
                alert("Tarefa cadastrada com sucesso!");
            }
            navigate("/"); // redireciona para home
        } catch (error) {
            console.error("Erro ao salvar tarefa:", error);
            alert("Erro ao salvar tarefa.");
        }
    }

    return (
        <div>
            {/* Formulário de cadastro/edição */}
            <form className="formulario" onSubmit={handleSubmit(salvarTarefa)}>
                <div>
                    <h1>Cadastro de Tarefas</h1>

                    {/* Campo descrição */}
                    <label htmlFor="description">Descrição</label>
                    <textarea
                        id="description"
                        {...register("description")}
                        onBlur={(e) => setValue("description", e.target.value.trim())}
                        placeholder="Insira a descrição aqui"
                    />
                    {errors.description && <p>{errors.description.message}</p>}
                </div>

                <div>
                    {/* Campo departamento */}
                    <label htmlFor="department">Departamento</label>
                    <input
                        id="department"
                        {...register("department")}
                        onBlur={(e) => setValue("department", e.target.value.trim())}
                        placeholder="Insira o departamento aqui"
                    />
                    {errors.department && <p>{errors.department.message}</p>}
                </div>

                <div>
                    {/* Campo usuário */}
                    <label htmlFor="user">Usuário</label>
                    <select id="user" {...register("user")}>
                        <option value="">Selecione um usuário</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.username}
                            </option>
                        ))}
                    </select>
                    {errors.user && <p>{errors.user.message}</p>}
                </div>

                <div>
                    {/* Campo prioridade */}
                    <label htmlFor="priority">Prioridade</label>
                    <select id="priority" {...register("priority")}>
                        <option value="low">Baixa</option>
                        <option value="medium">Média</option>
                        <option value="high">Alta</option>
                    </select>
                    {errors.priority && <p>{errors.priority.message}</p>}
                </div>

                {/* Botão de ação muda dependendo se é edição ou criação */}
                <button type="submit">{id ? "Salvar Alterações" : "Cadastrar Tarefa"}</button>
            </form>
        </div>
    )
}
