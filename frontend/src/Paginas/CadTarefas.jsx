import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { useParams, useNavigate } from "react-router-dom";
import z from "zod"

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

    user: z.coerce.number().min(1, 'Selecione um usuário'),

    priority: z.enum(['low', 'medium', 'high'], {
        errorMap: () => ({ message: 'Selecione uma prioridade' })
    })
});


export function CadTarefas() {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm({ resolver: zodResolver(schemaCadTarefas) });

    const [users, setUsers] = useState([]);

    //Buscar usuáris 
    useEffect(() => {
        axios.get("http://localhost:8000/user/")
            .then(res => setUsers(res.data))
            .catch(err => console.error("Erro ao buscar usuários:", err));
    }, []);

    //Se tive id buscar tarefa e preencher form
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

    // 🔹 Criar ou editar
    async function salvarTarefa(data) {
        try {
            if (id) {
                await axios.put(`http://localhost:8000/tasks/${id}`, data);
                alert("Tarefa atualizada com sucesso!");
            } else {
                await axios.post("http://localhost:8000/tasks/", data);
                alert("Tarefa cadastrada com sucesso!");
            }
            navigate("/");
        } catch (error) {
            console.error("Erro ao salvar tarefa:", error);
            alert("Erro ao salvar tarefa.");
        }
    }

    return (
        <div>
            
            <form className="formulario" onSubmit={handleSubmit(salvarTarefa)}>
                <div>
                <h1>Cadastro de Tarefas</h1>
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
                    <label htmlFor="priority">Prioridade</label>
                    <select id="priority" {...register("priority")}>
                        <option value="low">Baixa</option>
                        <option value="medium">Média</option>
                        <option value="high">Alta</option>
                    </select>
                    {errors.priority && <p>{errors.priority.message}</p>}
                </div>
                <button type="submit">{id ? "Salvar Alterações" : "Cadastrar Tarefa"}</button>
            </form>
        </div>
    )
}
