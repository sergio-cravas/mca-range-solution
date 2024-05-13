describe('template spec', () => {
  beforeEach(() => {
    cy.visit('/exercise1');
  });

  it('Check if range input renders and recieves correct props', () => {
    const requerimentsProps = {
      min: 0,
      max: 100,
    };

    cy.get('[role="slider"]')
      .should('have.attr', 'aria-valuemin', String(requerimentsProps.min))
      .should('have.attr', 'aria-valuemax', String(requerimentsProps.max))
      .should('have.attr', 'aria-valuetext', `Range between ${requerimentsProps.min} and ${requerimentsProps.max}`);
  });

  it('Check if can update range input labels', () => {
    const newMaxValue = 200.5;

    cy.get('[data-cy="range-input-label"]').last().clear().type(String(newMaxValue));

    cy.get('[role="slider"]').should('have.attr', 'aria-valuemax', String(newMaxValue));
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
