import { render, screen } from "@testing-library/react";
import Auth from './Auth';

test('initially the signup button is disabled', () => {
    render(<Auth/>);
    expect(screen.getByRole('button', {name: /signup/i})).toHaveProperty('disabled');
});