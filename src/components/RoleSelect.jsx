export function RoleSelect({ value, onChange }) {
return (
<select
value={value}
onChange={(e) => onChange(e.target.value)}
className="w-full p-2 border rounded mb-4"
>
<option value="comprador">Comprador</option>
<option value="empresa">Empresa</option>
<option value="admin">Administrador</option>
</select>
);
}