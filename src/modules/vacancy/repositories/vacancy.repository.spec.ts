import { VacancyMode, type VacancyModel, VacancyType } from '../models/vacancy.model';
import { VacancyRepository } from './vacancy.repository';

describe('VacancyRepository', () => {
  const makeModelMock = () => ({
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
  });

  const sampleRow = {
    id: '11111111-1111-1111-1111-111111111111',
    employerId: '22222222-2222-2222-2222-222222222222',
    description: 'Build and maintain frontend features.',
    company: 'Acme Inc',
    location: 'Remote',
    mode: VacancyMode.Online,
    type: VacancyType.Job,
    salary: 120000,
    isExpired: false,
    startDate: '2026-04-01',
    endDate: '2026-12-31',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };

  it('create: returns created row', async () => {
    const modelMock = makeModelMock();
    modelMock.create.mockResolvedValueOnce(sampleRow);
    const repo = new VacancyRepository(modelMock as typeof VacancyModel);

    const result = await repo.create({
      employerId: sampleRow.employerId,
      description: sampleRow.description,
      company: sampleRow.company,
      location: sampleRow.location,
      mode: sampleRow.mode,
      type: sampleRow.type,
      salary: sampleRow.salary,
      startDate: sampleRow.startDate,
      endDate: sampleRow.endDate,
    });

    expect(result).toEqual(sampleRow);
  });

  it('findById: returns row when found', async () => {
    const modelMock = makeModelMock();
    modelMock.findByPk.mockResolvedValueOnce(sampleRow);
    const repo = new VacancyRepository(modelMock as typeof VacancyModel);

    const result = await repo.findById(sampleRow.id);

    expect(result).toEqual(sampleRow);
  });

  it('findById: returns null when not found', async () => {
    const modelMock = makeModelMock();
    modelMock.findByPk.mockResolvedValueOnce(null);
    const repo = new VacancyRepository(modelMock as typeof VacancyModel);

    const result = await repo.findById('missing-id');

    expect(result).toBeNull();
  });

  it('list: returns rows', async () => {
    const modelMock = makeModelMock();
    modelMock.findAll.mockResolvedValueOnce([sampleRow]);
    const repo = new VacancyRepository(modelMock as typeof VacancyModel);

    const result = await repo.list({ limit: 10, offset: 0 });

    expect(result).toEqual([sampleRow]);
  });

  it('update: returns updated row', async () => {
    const modelMock = makeModelMock();
    const updated = { ...sampleRow, company: 'Updated Company' };
    modelMock.update.mockResolvedValueOnce([1, [updated]]);
    const repo = new VacancyRepository(modelMock as typeof VacancyModel);

    const result = await repo.update(sampleRow.id, { company: 'Updated Company' });

    expect(result).toEqual(updated);
  });

  it('update: returns null when not found', async () => {
    const modelMock = makeModelMock();
    modelMock.update.mockResolvedValueOnce([0, []]);
    const repo = new VacancyRepository(modelMock as typeof VacancyModel);

    const result = await repo.update('missing-id', { company: 'Updated Company' });

    expect(result).toBeNull();
  });
});
