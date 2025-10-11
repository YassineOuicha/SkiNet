using System.Linq.Expressions;

namespace Core.Interfaces;

// so we can return a list of T
public interface ISpecification<T>
{
    Expression<Func<T, bool>>?  Criteria { get; }
    Expression<Func<T, object>>? OrderBy { get; }
    Expression<Func<T, object>>? OrderByDescending { get; }
    bool IsDistinct { get; }
    int Take { get; }
    int Skip { get; }
    bool IsPagingEnabled {get; }
    IQueryable<T> ApplyCriteria(IQueryable<T> query);
}

// so we can return a list of string / bool / ...etc.
public interface ISpecification<T, TResult> : ISpecification<T>
{
    Expression<Func<T, TResult>>? Select { get; }
}