from unittest.mock import AsyncMock, Mock, MagicMock


def make_mock_db_commit(
    commit_side_effect=None,
    refresh_side_effect=None,
    add_side_effect=None,
    rollback_side_effect=None
):
    """
    Returns an AsyncMock db object with commit, refresh, add, and
    rollback mocked. You can pass side effects for each method
    (e.g., exceptions).
    """
    db = AsyncMock()
    db.commit = AsyncMock(side_effect=commit_side_effect)
    db.refresh = AsyncMock(side_effect=refresh_side_effect)
    db.add = MagicMock(side_effect=add_side_effect)
    db.rollback = AsyncMock(side_effect=rollback_side_effect)
    return db


def make_mock_db_execute(scalar_result):
    """
    Returns an AsyncMock db object whose execute() returns an object
    with scalar_one_or_none() returning scalar_result.
    """
    db = AsyncMock()
    mock_result = AsyncMock()
    mock_result.scalar_one_or_none = Mock(return_value=scalar_result)
    db.execute = AsyncMock(return_value=mock_result)
    return db
