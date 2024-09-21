/**
 * Faz o balanceamento de clientes para o Customer Success (CS) com base em seus níveis e disponibilidade.
 * @param {Array} customerSuccess - Matriz de objetos do Customer Success com id e pontuação.
 * @param {Array} customers - Matriz de objetos Customer com id e pontuação.
 * @param {Array} customerSuccessAway - Matriz de IDs de Customer Success indisponível.
 * @returns {Number} - O ID do Customer Success com o maior número de clientes atribuídos ou 0 em caso de empate.
 */
function customerSuccessBalancing(customerSuccess, customers, customerSuccessAway) {
  // Filtrar o sucesso do cliente disponivel
  const availableCustomerSuccess = customerSuccess.filter(cs => !customerSuccessAway.includes(cs.id));
  
  // Classifique os CS disponiveis por pontuação para uma atribuição eficiente
  availableCustomerSuccess.sort((a, b) => a.score - b.score);
  
  // Inicializar a contagem de atribuições de clientes
  const customerAssignmentsCount = new Map(availableCustomerSuccess.map(cs => [cs.id, 0]));

  // Atribuir clientes ao CS mais adequado 

  customers.forEach(customer => {
      const bestCS = availableCustomerSuccess.find(cs => cs.score >= customer.score);
      
      if (bestCS) {
          customerAssignmentsCount.set(bestCS.id, customerAssignmentsCount.get(bestCS.id) + 1);
      }
  });

  // Determinar o CS com o maior número de clientes
  let maxCount = 0;
  let maxCSId = 0;
  let isTie = false;

  customerAssignmentsCount.forEach((count, csId) => {
      if (count > maxCount) {
          maxCount = count;
          maxCSId = csId;
          isTie = false;
      } else if (count === maxCount) {
          isTie = true;
      }
  });

  return isTie ? 0 : maxCSId;
}

/*aqui vou adicionar outros cenarios de testes*/ 


test("Scenario 10 - All CSs Are Unavailable", () => {
  const css = [
    { id: 1, score: 60 },
    { id: 2, score: 80 },
    { id: 3, score: 100 },
  ];
  const customers = [
    { id: 1, score: 50 },
    { id: 2, score: 70 },
  ];
  const csAway = [1, 2, 3];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 11 - No Suitable CS for Customers", () => {
  const css = [
    { id: 1, score: 20 },
    { id: 2, score: 25 },
  ];
  const customers = [
    { id: 1, score: 30 },
    { id: 2, score: 40 },
  ];
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 12 - Multiple Customers for CS with Similar Scores", () => {
  const css = [
    { id: 1, score: 70 },
    { id: 2, score: 70 },
    { id: 3, score: 90 },
  ];
  const customers = [
    { id: 1, score: 50 },
    { id: 2, score: 60 },
    { id: 3, score: 70 },
    { id: 4, score: 80 },
  ];
  const csAway = [3];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});



test("Scenario 14 - Large Number of Customers and CSs", () => {
  const css = Array.from({ length: 100 }, (_, i) => ({ id: i + 1, score: 100 - i }));
  const customers = Array.from({ length: 1000 }, (_, i) => ({ id: i + 1, score: Math.floor(Math.random() * 100) }));
  const csAway = [1, 50];

  const result = customerSuccessBalancing(css, customers, csAway);
  expect(result).toBeGreaterThan(0);
});

test("Scenario 15 - CSs with Different Scores and Some Away", () => {
  const css = [
    { id: 1, score: 100 },
    { id: 2, score: 75 },
    { id: 3, score: 50 },
  ];
  const customers = [
    { id: 1, score: 80 },
    { id: 2, score: 20 },
    { id: 3, score: 30 },
    { id: 4, score: 60 },
    { id: 5, score: 90 },
  ];
  const csAway = [2];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});


test("Scenario 1", () => {
  const css = [
    { id: 1, score: 60 },
    { id: 2, score: 20 },
    { id: 3, score: 95 },
    { id: 4, score: 75 },
  ];
  const customers = [
    { id: 1, score: 90 },
    { id: 2, score: 20 },
    { id: 3, score: 70 },
    { id: 4, score: 40 },
    { id: 5, score: 60 },
    { id: 6, score: 10 },
  ];
  const csAway = [2, 4];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

function buildSizeEntities(size, score) {
  const result = [];
  for (let i = 0; i < size; i += 1) {
    result.push({ id: i + 1, score });
  }
  return result;
}

function mapEntities(arr) {
  return arr.map((item, index) => ({
    id: index + 1,
    score: item,
  }));
}

function arraySeq(count, startAt){
  return Array.apply(0, Array(count)).map((it, index) => index + startAt);
}

test("Scenario 2", () => {
  const css = mapEntities([11, 21, 31, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 3", () => {
  const testTimeoutInMs = 100;
  const testStartTime = new Date().getTime();

  const css = mapEntities(arraySeq(999, 1));
  const customers = buildSizeEntities(10000, 998);
  const csAway = [999];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(998);

  if (new Date().getTime() - testStartTime > testTimeoutInMs) {
    throw new Error(`Test took longer than ${testTimeoutInMs}ms!`);
  }
});

test("Scenario 4", () => {
  const css = mapEntities([1, 2, 3, 4, 5, 6]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 5", () => {
  const css = mapEntities([100, 2, 3, 6, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

test("Scenario 6", () => {
  const css = mapEntities([100, 99, 88, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [1, 3, 2];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 7", () => {
  const css = mapEntities([100, 99, 88, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [4, 5, 6];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(3);
});

test("Scenario 8", () => {
  const css = mapEntities([60, 40, 95, 75]);
  const customers = mapEntities([90, 70, 20, 40, 60, 10]);
  const csAway = [2, 4];
  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});
