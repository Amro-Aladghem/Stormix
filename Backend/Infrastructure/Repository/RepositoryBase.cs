using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace Infrastructure.Repository
{
    public class RepositoryBase<T> : IRepositoryBase<T> where T :class
    {
        protected AppDbContext _appDbContext { get; set; }

        public RepositoryBase(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public void Create(T entity)
        {
            _appDbContext.Set<T>().Add(entity);
        }

        public void Delete(T entity)
        {
            _appDbContext.Set<T>().Remove(entity);
        }

        public IQueryable<T> FindAll(bool trackChanges)
        {
            if(trackChanges)
            {
                return _appDbContext.Set<T>();
            }

            return _appDbContext.Set<T>().AsNoTracking();
        }

        public IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression, bool trackChanges)
        {
            if(trackChanges)
            {
                return _appDbContext.Set<T>().Where(expression);

            }

            return _appDbContext.Set<T>().Where(expression).AsNoTracking();
        }

        public void Update(T entity)
        {
            _appDbContext.Set<T>().Update(entity);
        }
    }
}
