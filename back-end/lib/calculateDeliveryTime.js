// Calcular el tiempo de entrega en minutos
const calculateDeliveryTime = (start, end) => {
    const ms = new Date(end) - new Date(start);
    return ms > 0 ? Math.floor(ms / 60000) : null;
};

module.exports = calculateDeliveryTime;