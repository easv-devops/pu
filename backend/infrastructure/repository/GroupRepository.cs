﻿using System.Data.SqlTypes;
using System.Security.Authentication;
using api.models;
using Dapper;
using Npgsql;

namespace infrastructure.repository;

public class GroupRepository
{
    private readonly NpgsqlDataSource _dataSource;

    public GroupRepository(NpgsqlDataSource dataSource)
    {
        _dataSource = dataSource;
    }

    public Group CreateGroup(Group group)
    {
        var sql =
            $@"
            insert into groups.group (name, description, image_url, created_date) 
            values (@Name, @Description, @ImageUrl, @CreatedDate) 
            returning *;
            ";

        try
        {
            using var conn = _dataSource.OpenConnection();
            return conn.QueryFirst<Group>(sql,
                new { group.Name, group.Description, group.ImageUrl, group.CreatedDate });
        }
        catch (Exception e)
        {
            throw new SqlTypeException("Could not create group", e);
        }
    }

    public bool AddUserToGroup(int userId, int groupId, bool isOwner)
    {
        var sql =
            $@"
            insert into groups.group_members (user_id, group_id, owner) 
            values (@userId, @groupId, @isOwner);
            ";

        try
        {
            using var conn = _dataSource.OpenConnection();
            return conn.Execute(sql, new { userId, groupId, isOwner }) == 1;
        }
        catch (Exception e)
        {
            throw new SqlTypeException("Could not add User to Group", e);
        }
    }

    public bool IsUserInGroup(int userId, int groupId)
    {
        var sql =
            $@"
            select * from groups.group_members 
            where user_id = @userId  
            and group_id = @groupId;
            ";

        try
        {
            using var conn = _dataSource.OpenConnection();
            return conn.QuerySingleOrDefault(sql, new { userId, groupId }) != null;
        }
        catch (Exception e)
        {
            throw new AuthenticationException();
        }
    }

    public Group GetGroupById(int groupId)
    {
        var sql =
            $@"
            select 
                id as {nameof(Group.Id)},
                name as {nameof(Group.Name)},
                description as {nameof(Group.Description)},
                image_url as {nameof(Group.ImageUrl)},
                created_date as {nameof(Group.CreatedDate)}
            from groups.group 
            where id = @groupId;
            ";

        try
        {
            using var conn = _dataSource.OpenConnection();
            return conn.QueryFirst<Group>(sql, new { groupId });
        }
        catch (Exception e)
        {
            throw new SqlTypeException("Could not read the group", e);
        }
    }
}