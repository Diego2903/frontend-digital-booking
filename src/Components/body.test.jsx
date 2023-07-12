import { render, screen } from "@testing-library/react";
import Body from "./Body";
import {test, describe, expect} from 'jest'

describe("Body component", () => {
  test("renders input fields and button", () => {
    render(<Body />);

    // Verifica que los campos de entrada estén presentes
    expect(screen.getByPlaceholderText("¿A dónde vamos?")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("¿Qué tipo de experiencia?")).toBeInTheDocument();
    
    // Verifica que el botón esté presente
    expect(screen.getByText("Buscar")).toBeInTheDocument();
  });

});

