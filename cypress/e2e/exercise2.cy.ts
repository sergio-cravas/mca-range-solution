describe('template spec', () => {
  before(() => {
    cy.visit('/exercise2');
  });

  it('Check if range input renders and recieves correct props', async () => {
    const requerimentsProps = {
      min: 1.99,
      max: 70.99,
    };

    cy.get('[role="slider"]')
      .should('have.attr', 'aria-valuemin', String(requerimentsProps.min))
      .should('have.attr', 'aria-valuemax', String(requerimentsProps.max))
      .should('have.attr', 'aria-valuetext', `Range between ${requerimentsProps.min} and ${requerimentsProps.max}`);
  });
});
