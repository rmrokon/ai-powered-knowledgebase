import { PrismaClient } from '@prisma/client'

type ModelDelegate = {
  findMany: (...args: any[]) => Promise<any[]>
  findUnique: (...args: any[]) => Promise<any | null>
  findFirst: (...args: any[]) => Promise<any | null>
  create: (...args: any[]) => Promise<any>
  update: (...args: any[]) => Promise<any>
  delete: (...args: any[]) => Promise<any>
  deleteMany: (...args: any[]) => Promise<any>
  updateMany: (...args: any[]) => Promise<any>
  count: (...args: any[]) => Promise<number>
}

type ModelName = {
  [K in keyof PrismaClient]: PrismaClient[K] extends ModelDelegate ? K : never
}[keyof PrismaClient]

export interface BaseRepositoryOptions {
  include?: Record<string, any>
  select?: Record<string, any>
}

export abstract class BaseRepository<TModel, TCreateInput, TUpdateInput> {
  protected readonly db: PrismaClient
  protected readonly model: ModelName
  protected readonly defaultOptions: BaseRepositoryOptions

  constructor(
    db: PrismaClient, 
    model: ModelName,
    defaultOptions: BaseRepositoryOptions = {}
  ) {
    this.db = db
    this.model = model
    this.defaultOptions = defaultOptions
  }

  protected getModelDelegate() {
    return this.db[this.model] as any
  }

  protected mergeOptions(options?: BaseRepositoryOptions) {
    return {
      ...this.defaultOptions,
      ...options,
    }
  }

  async findAll(options?: BaseRepositoryOptions): Promise<TModel[]> {
    const delegate = this.getModelDelegate()
    const mergedOptions = this.mergeOptions(options)
    
    return delegate.findMany(mergedOptions)
  }

  async findById(id: string, options?: BaseRepositoryOptions): Promise<TModel | null> {
    const delegate = this.getModelDelegate()
    const mergedOptions = this.mergeOptions(options)
    
    return delegate.findUnique({
      where: { id },
      ...mergedOptions,
    })
  }

  async findFirst(where: any, options?: BaseRepositoryOptions): Promise<TModel | null> {
    const delegate = this.getModelDelegate()
    const mergedOptions = this.mergeOptions(options)
    
    return delegate.findFirst({
      where,
      ...mergedOptions,
    })
  }

  async findMany(where: any, options?: BaseRepositoryOptions): Promise<TModel[]> {
    const delegate = this.getModelDelegate()
    const mergedOptions = this.mergeOptions(options)
    
    return delegate.findMany({
      where,
      ...mergedOptions,
    })
  }

  async create(data: TCreateInput, options?: BaseRepositoryOptions): Promise<TModel> {
    const delegate = this.getModelDelegate()
    const mergedOptions = this.mergeOptions(options)
    
    return delegate.create({
      data,
      ...mergedOptions,
    })
  }

  async update(id: string, data: TUpdateInput, options?: BaseRepositoryOptions): Promise<TModel> {
    const delegate = this.getModelDelegate()
    const mergedOptions = this.mergeOptions(options)
    
    return delegate.update({
      where: { id },
      data,
      ...mergedOptions,
    })
  }

  async upsert(
    where: { id: string }, 
    create: TCreateInput, 
    update: TUpdateInput,
    options?: BaseRepositoryOptions
  ): Promise<TModel> {
    const delegate = this.getModelDelegate()
    const mergedOptions = this.mergeOptions(options)
    
    return delegate.upsert({
      where,
      create,
      update,
      ...mergedOptions,
    })
  }

  async delete(id: string): Promise<TModel> {
    const delegate = this.getModelDelegate()
    
    return delegate.delete({
      where: { id },
    })
  }

  async deleteMany(where: any): Promise<{ count: number }> {
    const delegate = this.getModelDelegate()
    
    return delegate.deleteMany({
      where,
    })
  }

  async count(where?: any): Promise<number> {
    const delegate = this.getModelDelegate()
    
    return delegate.count({
      where,
    })
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.count({ id })
    return count > 0
  }

  // Pagination helper
  async findManyWithPagination(
    where: any = {},
    page: number = 1,
    limit: number = 10,
    orderBy?: any,
    options?: BaseRepositoryOptions
  ): Promise<{
    data: TModel[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }> {
    const skip = (page - 1) * limit
    const delegate = this.getModelDelegate()
    const mergedOptions = this.mergeOptions(options)

    const [data, total] = await Promise.all([
      delegate.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        ...mergedOptions,
      }),
      delegate.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    }
  }
}