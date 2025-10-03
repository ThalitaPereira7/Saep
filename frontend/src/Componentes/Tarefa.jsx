//props: são propriedades que passam de um componente para outro
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Tarefa({ tarefa }) {
    
    const navigate = useNavigate();
    
    function handleEdit(id) {
        navigate(`cadTarefas/${id}`);
    }

    function handleDelete(id) {
        const apiURL = `http://127.0.0.1:8000/tasks/${id}`;
        axios.delete(apiURL)
            .then(response => {
                console.log("Tarefa excluída", response.data);
            })
            .catch(error => {
                console.error("Erro ao excluir tarefa", error);
            });
    }

    function handleStatusChange(event) {
        event.preventDefault();
        const newStatus = event.target.status.value;
        const apiURL = `http://127.0.0.1:8000/tasks/${tarefa.id}`;
        axios.patch(apiURL, { status: newStatus })
            .then(response => {
                window.location.reload();
            })
            .catch(error => {
                console.error("Erro ao atualizar status da tarefa", error);
            });
    }

    return (
        <article className="tarefa">
            <div>
                <h3 id={tarefa.id}>Descrição: </h3>
                <p>{tarefa.description}</p>
            </div>
            <dl>
                <dt>Setor:</dt>
                <dd>{tarefa.department}</dd>

                <dt>Prioridade:</dt>
                <dd>{tarefa.priority == 'low' ? 'Baixa' : tarefa.priority == 'medium' ? 'Média' : 'Alta'}</dd>

                <dt>Vinculado a:</dt>
                <dd>{tarefa.user_name}</dd>
            </dl>
            <button type="submit" onClick={() => handleEdit(tarefa.id)}>Editar</button>
            <button type="submit" onClick={() => handleDelete(tarefa.id)}>Excluir</button>

            <form className="formStatus" onSubmit={handleStatusChange}>
                <label>Status:</label>
                <select id={tarefa.id} name="status">
                    <option value=''>Selecione o status</option>
                    <option value='todo'>A fazer</option>
                    <option value='doing'>Fazendo</option>
                    <option value='done'>Pronto</option>
                </select>
                <button type='submit'>Alterar Status</button>
            </form>
        </article>
    )
}