describe('template spec', () => {
  beforeEach(() => {
    cy.visit('/exercise2');
  });

  it('Check if range input renders and recieves correct props', () => {
    const requerimentsProps = {
      min: 1.99,
      max: 70.99,
    };

    cy.get('[role="slider"]')
      .should('have.attr', 'aria-valuemin', String(requerimentsProps.min))
      .should('have.attr', 'aria-valuemax', String(requerimentsProps.max))
      .should('have.attr', 'aria-valuetext', `Range between ${requerimentsProps.min} and ${requerimentsProps.max}`);
  });

  it('Move min thumn', () => {
    const requerimentsProps = {
      min: 1.99,
      max: 70.99,
    };

    cy.get("[data-testid='minimum-thumb']")
      .should('be.visible')
      .trigger('mousedown', { which: 1 })
      .trigger('mousemove', { clientX: 500 })
      .trigger('mouseup', {});

    cy.get('[role="slider"]').should(($slider) => {
      const value = $slider.attr('aria-valuetext');

      expect(value).not.to.eq(`Range between ${requerimentsProps.min} and ${requerimentsProps.max}`);
    });
  });
});
