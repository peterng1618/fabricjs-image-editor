import {
  resolveActiveSelectionShapeScaleConstraint,
  resolveMinimumSelectionScaleForSize,
  resolveProportionalSelectionScale,
  resolveSelectionAvailableHeight,
  resolveSelectionAvailableWidth
} from '../../../../src/editor/shape-manager/scaling/active-selection-scale-constraints'

describe('ограничения скейлинга шейпов в общем выделении', () => {
  it('учитывает числовой origin при расчёте доступной ширины', () => {
    const selectionBounds = { bottom: 100, left: 0, right: 100, top: 0 }
    const shapeBounds = { bottom: 60, left: 20, right: 40, top: 40 }

    expect(resolveSelectionAvailableWidth({
      originX: 0.25,
      selectionBounds,
      shapeBounds
    })).toBe(80)
    expect(resolveSelectionAvailableWidth({
      originX: 0.75,
      selectionBounds,
      shapeBounds
    })).toBe(40)
  })

  it('учитывает вертикальную привязку при расчёте доступной высоты', () => {
    const selectionBounds = { bottom: 100, left: 0, right: 100, top: 0 }
    const shapeBounds = { bottom: 70, left: 20, right: 40, top: 30 }

    expect(resolveSelectionAvailableHeight({
      selectionBounds,
      shapeBounds,
      verticalAttachment: 'top'
    })).toBe(70)
    expect(resolveSelectionAvailableHeight({
      selectionBounds,
      shapeBounds,
      verticalAttachment: 'bottom'
    })).toBe(70)
    expect(resolveSelectionAvailableHeight({
      selectionBounds,
      shapeBounds,
      verticalAttachment: 'center'
    })).toBe(100)
  })

  it('не увеличивает общую рамку из-за минимума запрещённой оси', () => {
    expect(resolveMinimumSelectionScaleForSize({
      allowGrowth: true,
      minimumSize: 120,
      startSize: 100
    })).toBe(1.2)
    expect(resolveMinimumSelectionScaleForSize({
      allowGrowth: false,
      minimumSize: 120,
      startSize: 100
    })).toBe(1)
  })

  it('выбирает наибольшее ограничение среди всех шейпов', () => {
    const constraints = [{
      availableHeight: 100,
      availableWidth: 200,
      canScaleHeight: true,
      canScaleWidth: true,
      minimumHeight: 80,
      minimumWidth: 100
    }]

    expect(resolveProportionalSelectionScale({
      allowGrowthX: true,
      allowGrowthY: true,
      constraints,
      requestedScale: 0.25
    })).toBe(0.8)
    expect(resolveProportionalSelectionScale({
      allowGrowthX: true,
      allowGrowthY: true,
      constraints: [],
      requestedScale: 0.25
    })).toBe(0.25)
  })

  it('собирает ограничения шейпа в координатах общей рамки', () => {
    const constraint = resolveActiveSelectionShapeScaleConstraint({
      layoutMinimumScale: 0.5,
      limits: {
        canScaleHeight: true,
        canScaleWidth: true,
        startHeight: 80,
        startWidth: 100
      },
      selectionBounds: { bottom: 200, left: 0, right: 200, top: 0 },
      shapeBounds: { bottom: 110, left: 20, right: 120, top: 30 },
      transformOriginX: 'center',
      verticalAttachment: 'top'
    })

    expect(constraint.availableWidth).toBe(140)
    expect(constraint.availableHeight).toBe(170)
    expect(constraint.minimumWidth).toBe(50)
    expect(constraint.minimumHeight).toBe(40)
  })
})
