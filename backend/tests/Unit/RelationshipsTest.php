<?php

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

describe('User Relationships', function () {
    test('user has many projects relation is configured correctly', function () {
        $user = new User();
        $relation = $user->projects();

        expect($relation)->toBeInstanceOf(HasMany::class)
            ->and($relation->getRelated())->toBeInstanceOf(Project::class)
            ->and($relation->getForeignKeyName())->toBe('user_id')
            ->and($relation->getLocalKeyName())->toBe('id');
    });
});

describe('Project Relationships', function () {
    test('project belongs to user relation is configured correctly', function () {
        $project = new Project();
        $relation = $project->user();

        expect($relation)->toBeInstanceOf(BelongsTo::class)
            ->and($relation->getRelated())->toBeInstanceOf(User::class)
            ->and($relation->getForeignKeyName())->toBe('user_id')
            ->and($relation->getOwnerKeyName())->toBe('id');
    });

    test('project has many tasks relation is configured correctly', function () {
        $project = new Project();
        $relation = $project->tasks();

        expect($relation)->toBeInstanceOf(HasMany::class)
            ->and($relation->getRelated())->toBeInstanceOf(Task::class)
            ->and($relation->getForeignKeyName())->toBe('project_id')
            ->and($relation->getLocalKeyName())->toBe('id');
    });

    test('project Task alias method works properly', function () {
        $project = new Project();

        expect($project->Task())->toBeInstanceOf(HasMany::class)
            ->and($project->Task()->getRelated())->toBeInstanceOf(Task::class);
    });
});

describe('Task Relationships', function () {
    test('task belongs to project relation is configured correctly', function () {
        $task = new Task();
        $relation = $task->project();

        expect($relation)->toBeInstanceOf(BelongsTo::class)
            ->and($relation->getRelated())->toBeInstanceOf(Project::class)
            ->and($relation->getForeignKeyName())->toBe('project_id')
            ->and($relation->getOwnerKeyName())->toBe('id');
    });
});