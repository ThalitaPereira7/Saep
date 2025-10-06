import { render, screen, fireEvent } from "@testing-library/react";
import { Tarefa } from "../Componentes/Tarefa";
import { describe, it, vi, expect } from "vitest";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";

vi.mock("axios");

describe("Componente tareaf", () => {
    const mockTarefa = {
        id: 1,
        description: "Fazer um brainstrming",
        department: "Senai/Ler",
        priority: "high",
        user_name: "Rafael Scanacapra Fretes Lima Junior",
    };

    it("deve renderizar os dados da tarefa", () => {
        render(
            <BrowserRouter>
                <Tarefa tarefa={mockTarefa} />
            </BrowserRouter>
        );
        screen.debug();
        expect(screen.getByText("Fazer um brainstrming")).toBeTruthy();
        expect(screen.getByText("Senai/Ler")).toBeTruthy();
        expect(screen.getByText("Alta")).toBeTruthy();
        expect(screen.getByText("Rafael Scanacapra Fretes Lima Junior")).toBeTruthy();
    });

    it("deve chamar axios.delete ao clicar em Excluir", () => {
        axios.delete.mockResolvedValue({ data: "ok" });

        render(
            <BrowserRouter>
                <Tarefa tarefa={mockTarefa} />
            </BrowserRouter>
        );

        const deleteButton = screen.getByRole("button", { name: /Excluir/i });
        fireEvent.click(deleteButton);

        expect(axios.delete).toHaveBeenCalledWith(
            "http://127.0.0.1:8000/tasks/1"
        );
    });
});
