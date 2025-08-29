// Datos de productos
const productos = [
    { id: 1, nombre: "Crouton", precio: 2.71 },
    { id: 2, nombre: "Mini Tostadas", precio: 2.71 },
    { id: 3, nombre: "Pan Molido", precio: 0.67 },
    { id: 4, nombre: "Panko", precio: 5 },
    { id: 5, nombre: "Pan de Sandwich", precio: 2.79 },
    { id: 6, nombre: "Pan de Sandwich con concha", precio: 2.79 },
    { id: 7, nombre: "Pan de Perro caliente", precio: 1.60 },
    { id: 8, nombre: "Pan de Hamburguesa", precio: 1.75 },
    { id: 9, nombre: "Palmeritas", precio: 3.10 },
    { id: 10, nombre: "Tequeños de 12 unidades", precio: 5.68 },
    { id: 11, nombre: "Tequeños de 24 unidades", precio: 11.10 },
    { id: 12, nombre: "Tequeños de 36 unidades", precio: 16.24 },
    { id: 13, nombre: "Masa de Hojaldre", precio: 4.74 },
    { id: 14, nombre: "Empanaditas de queso 36 unidades", precio: 6.16 }
];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Configurar fecha actual
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fecha').value = hoy;
    document.getElementById('fechaConsulta').value = hoy;
    
    // Cargar productos
    cargarProductos();
    
    // Event listeners
    document.querySelector('.add-product').addEventListener('click', addProduct);
    document.getElementById('guardarVenta').addEventListener('click', guardarVenta);
    document.getElementById('exportarPDF').addEventListener('click', exportarAPDF);
    document.getElementById('fechaConsulta').addEventListener('change', () => consultarVentas('dia'));
    document.getElementById('mesConsulta').addEventListener('change', () => consultarVentas('mes'));
    document.getElementById('anioConsulta').addEventListener('change', () => consultarVentas('anio'));
});

// Funciones para productos
function cargarProductos() {
    const selects = document.querySelectorAll('.producto');
    
    selects.forEach(select => {
        select.innerHTML = '<option value="">Seleccione producto</option>';
        
        productos.forEach(producto => {
            const option = document.createElement('option');
            option.value = producto.id;
            option.textContent = `${producto.nombre} - $${producto.precio}`;
            select.appendChild(option);
        });
        
        select.addEventListener('change', function() {
            const productoId = this.value;
            const producto = productos.find(p => p.id == productoId);
            const precioInput = this.closest('.product-row').querySelector('.precio');
            
            if (producto) {
                precioInput.value = producto.precio;
            } else {
                precioInput.value = '';
            }
            actualizarSubtotal(this.closest('.product-row'));
        });
    });
    
    document.querySelectorAll('.cantidad').forEach(input => {
        input.addEventListener('input', function() {
            actualizarSubtotal(this.closest('.product-row'));
        });
    });
}

function addProduct() {
    const container = document.getElementById('productos-container');
    const newRow = document.createElement('div');
    newRow.className = 'product-row';
    newRow.innerHTML = `
        <select class="producto" required>
            <option value="">Seleccione producto</option>
        </select>
        <input type="number" class="cantidad" min="1" value="1" required>
        <input type="number" class="precio" readonly>
        <span class="subtotal">Subtotal: $0.00</span>
        <button type="button" class="remove-product">Eliminar</button>
    `;
    container.appendChild(newRow);
    
    // Configurar nuevo producto
    const productoSelect = newRow.querySelector('.producto');
    productos.forEach(producto => {
        const option = document.createElement('option');
        option.value = producto.id;
        option.textContent = `${producto.nombre} - $${producto.precio}`;
        productoSelect.appendChild(option);
    });
    
    // Event listeners
    productoSelect.addEventListener('change', function() {
        const producto = productos.find(p => p.id == this.value);
        const precioInput = this.closest('.product-row').querySelector('.precio');
        precioInput.value = producto ? producto.precio : '';
        actualizarSubtotal(this.closest('.product-row'));
    });
    
    newRow.querySelector('.cantidad').addEventListener('input', function() {
        actualizarSubtotal(this.closest('.product-row'));
    });
    
    newRow.querySelector('.remove-product').addEventListener('click', function() {
        const rows = document.querySelectorAll('.product-row');
        if (rows.length > 1) {
            this.closest('.product-row').remove();
            calcularTotal();
        } else {
            alert('Debe haber al menos un producto en la venta.');
        }
    });
}

function actualizarSubtotal(row) {
    const cantidad = parseFloat(row.querySelector('.cantidad').value) || 0;
    const precio = parseFloat(row.querySelector('.precio').value) || 0;
    const subtotal = cantidad * precio;
    
    row.querySelector('.subtotal').textContent = `Subtotal: $${subtotal.toFixed(2)}`;
    calcularTotal();
}

function calcularTotal() {
    let total = 0;
    
    document.querySelectorAll('.product-row').forEach(row => {
        const cantidad = parseFloat(row.querySelector('.cantidad').value) || 0;
        const precio = parseFloat(row.querySelector('.precio').value) || 0;
        total += cantidad * precio;
    });
    
    document.getElementById('total').textContent = total.toFixed(2);
}

function guardarVenta() {
    const fecha = document.getElementById('fecha').value;
    const factura = document.getElementById('factura').value;
    const cliente = document.getElementById('cliente').value;
    
    if (!fecha || !factura || !cliente) {
        alert('Complete todos los campos obligatorios');
        return;
    }
    
    const productosVenta = [];
    let productosValidos = true;
    
    document.querySelectorAll('.product-row').forEach(row => {
        const productoId = row.querySelector('.producto').value;
        const cantidad = row.querySelector('.cantidad').value;
        const precio = row.querySelector('.precio').value;
        
        if (!productoId || !cantidad || !precio) {
            productosValidos = false;
            return;
        }
        
        const producto = productos.find(p => p.id == productoId);
        productosVenta.push({
            id: productoId,
            nombre: producto.nombre,
            cantidad: parseFloat(cantidad),
            precio: parseFloat(precio),
            subtotal: parseFloat(cantidad) * parseFloat(precio)
        });
    });
    
    if (!productosValidos || productosVenta.length === 0) {
        alert('Complete todos los productos correctamente');
        return;
    }
    
    const total = parseFloat(document.getElementById('total').textContent);
    const ventas = JSON.parse(localStorage.getItem('ventas')) || [];
    
    ventas.push({
        fecha,
        factura,
        cliente,
        productos: productosVenta,
        total
    });
    
    localStorage.setItem('ventas', JSON.stringify(ventas));
    alert('Venta guardada correctamente');
    limpiarFormulario();
}

function limpiarFormulario() {
    document.getElementById('factura').value = '';
    document.getElementById('cliente').value = '';
    document.getElementById('productos-container').innerHTML = `
        <div class="product-row">
            <select class="producto" required>
                <option value="">Seleccione producto</option>
            </select>
            <input type="number" class="cantidad" min="1" value="1" required>
            <input type="number" class="precio" readonly>
            <span class="subtotal">Subtotal: $0.00</span>
            <button type="button" class="remove-product">Eliminar</button>
        </div>
    `;
    document.getElementById('total').textContent = '0.00';
    cargarProductos();
}

function consultarVentas(tipo) {
    const ventas = JSON.parse(localStorage.getItem('ventas')) || [];
    
    if (ventas.length === 0) {
        document.getElementById(`resultado${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`).innerHTML = 
            '<p>No hay ventas registradas.</p>';
        return;
    }
    
    let ventasFiltradas = [];
    let titulo = '';
    
    switch (tipo) {
        case 'dia':
            const fechaConsulta = document.getElementById('fechaConsulta').value;
            ventasFiltradas = ventas.filter(v => v.fecha === fechaConsulta);
            titulo = `Ventas del día ${fechaConsulta}`;
            break;
            
        case 'mes':
            const mesConsulta = document.getElementById('mesConsulta').value;
            ventasFiltradas = ventas.filter(v => v.fecha.startsWith(mesConsulta));
            titulo = `Ventas del mes ${mesConsulta}`;
            break;
            
        case 'anio':
            const anioConsulta = document.getElementById('anioConsulta').value;
            ventasFiltradas = ventas.filter(v => v.fecha.startsWith(anioConsulta));
            titulo = `Ventas del año ${anioConsulta}`;
            break;
    }
    
    if (ventasFiltradas.length === 0) {
        document.getElementById(`resultado${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`).innerHTML = 
            `<p>No hay ventas para ${titulo.toLowerCase()}.</p>`;
        return;
    }
    
    let html = `<h3>${titulo}</h3><table><tr><th>Factura</th><th>Cliente</th><th>Productos</th><th>Total</th></tr>`;
    
    ventasFiltradas.forEach(venta => {
        html += `<tr>
            <td>${venta.factura}</td>
            <td>${venta.cliente}</td>
            <td><ul>${
                venta.productos.map(p => 
                    `<li>${p.nombre} - ${p.cantidad} x $${p.precio.toFixed(2)} = $${p.subtotal.toFixed(2)}</li>`
                ).join('')
            }</ul></td>
            <td>$${venta.total.toFixed(2)}</td>
        </tr>`;
    });
    
    html += '</table>';
    
    const totalPeriodo = ventasFiltradas.reduce((sum, venta) => sum + venta.total, 0);
    html += `<div class="total-section">Total del período: $${totalPeriodo.toFixed(2)}</div>`;
    
    document.getElementById(`resultado${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`).innerHTML = html;
}

function exportarAPDF() {
    const ventas = JSON.parse(localStorage.getItem('ventas')) || [];
    if (ventas.length === 0) {
        alert('No hay datos para exportar');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Reporte de Ventas', 105, 15, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 105, 22, { align: 'center' });
    
    let y = 30;
    doc.setFontSize(12);
    
    ventas.forEach((venta, index) => {
        doc.text(`Factura #${venta.factura} - ${venta.fecha}`, 14, y);
        doc.text(`Cliente: ${venta.cliente}`, 14, y + 7);
        
        doc.text('Productos:', 14, y + 14);
        venta.productos.forEach((prod, i) => {
            doc.text(`- ${prod.nombre} (${prod.cantidad} x $${prod.precio.toFixed(2)})`, 20, y + 21 + (i * 7));
        });
        
        doc.text(`Total: $${venta.total.toFixed(2)}`, 160, y + 21 + (venta.productos.length * 7));
        y += 35 + (venta.productos.length * 7);
        
        if (y > 250 && index < ventas.length - 1) {
            doc.addPage();
            y = 20;
        }
    });
    
    doc.save(`reporte_ventas_${new Date().toISOString().slice(0, 10)}.pdf`);
}

function openTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    
    const tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Función principal para generar el ranking
function generarRanking() {
    const mesSeleccionado = document.getElementById('mesRanking').value;
    if (!mesSeleccionado) return;

    const ventas = JSON.parse(localStorage.getItem('ventas')) || [];
    const ventasDelMes = ventas.filter(v => v.fecha.startsWith(mesSeleccionado));

    // Objeto para acumular ventas por producto
    const ranking = {};

    // Procesar todas las ventas del mes
    ventasDelMes.forEach(venta => {
        venta.productos.forEach(productoVenta => {
            if (!ranking[productoVenta.id]) {
                const productoOriginal = productos.find(p => p.id == productoVenta.id);
                ranking[productoVenta.id] = {
                    nombre: productoOriginal.nombre,
                    unidades: 0,
                    total: 0
                };
            }
            ranking[productoVenta.id].unidades += productoVenta.cantidad;
            ranking[productoVenta.id].total += productoVenta.subtotal;
        });
    });

    // Convertir a array y ordenar
    const rankingArray = Object.values(ranking);
    rankingArray.sort((a, b) => b.unidades - a.unidades);

    mostrarRanking(rankingArray);
}

// Función para mostrar el ranking en la tabla
function mostrarRanking(ranking) {
    const contenedor = document.getElementById('resultadoRanking');
    
    if (ranking.length === 0) {
        contenedor.innerHTML = '<p>No hay ventas registradas este mes.</p>';
        return;
    }

    let html = `
        <table>
            <tr class="ranking-header">
                <th>Posición</th>
                <th>Producto</th>
                <th>Unidades Vendidas</th>
                <th>Total Vendido</th>
            </tr>
    `;

    ranking.forEach((producto, index) => {
        const top3Badge = index < 3 ? `<span class="badge-top">${index + 1}</span> ` : '';
        html += `
            <tr class="ranking-row">
                <td class="ranking-position">${top3Badge}</td>
                <td>${producto.nombre}</td>
                <td>${producto.unidades}</td>
                <td>$${producto.total.toFixed(2)}</td>
            </tr>
        `;
    });

    html += `</table>`;
    
    // Resumen total
    const totalUnidades = ranking.reduce((sum, p) => sum + p.unidades, 0);
    const totalVendido = ranking.reduce((sum, p) => sum + p.total, 0);
    
    html += `
        <div class="total-section">
            <p><strong>Total del mes:</strong></p>
            <p>Unidades vendidas: ${totalUnidades}</p>
            <p>Monto total: $${totalVendido.toFixed(2)}</p>
        </div>
    `;

    contenedor.innerHTML = html;
}

// Inicializar el mes actual al cargar
document.addEventListener('DOMContentLoaded', function() {
    const mesActual = new Date().toISOString().slice(0, 7);
    document.getElementById('mesRanking').value = mesActual;
    generarRanking(); // Generar ranking automáticamente al cargar
});