<?php

use App\Models\Project;
use App\Models\Role;
use App\Models\Task;
use App\Models\User;

describe('Database Relationships Integration', function () {

    test('a user can have multiple projects', function () {
        $user = User::factory()->create();

        $project1 = Project::factory()->create(['user_id' => $user->id, 'name' => 'Project Alpha']);
        $project2 = Project::factory()->create(['user_id' => $user->id, 'name' => 'Project Beta']);

        expect($user->projects)->toHaveCount(2)
            ->and($user->projects->pluck('id')->all())->toContain($project1->id, $project2->id);
    });

    test('a project belongs to a user', function () {
        $user = User::factory()->create(['name' => 'John Doe']);
        $project = Project::factory()->create(['user_id' => $user->id]);

        expect($project->user)->not->toBeNull()
            ->and($project->user->id)->toBe($user->id)
            ->and($project->user->name)->toBe('John Doe');
    });

    test('a project can have multiple tasks', function () {
        $project = Project::factory()->create();

        $task1 = Task::factory()->create(['project_id' => $project->id, 'title' => 'Task 1']);
        $task2 = Task::factory()->create(['project_id' => $project->id, 'title' => 'Task 2']);

        expect($project->tasks)->toHaveCount(2)
            ->and($project->tasks->pluck('id')->all())->toContain($task1->id, $task2->id);
    });

    test('a task belongs to a project', function () {
        $project = Project::factory()->create(['name' => 'Main Project']);
        $task = Task::factory()->create(['project_id' => $project->id]);

        expect($task->project)->not->toBeNull()
            ->and($task->project->id)->toBe($project->id)
            ->and($task->project->name)->toBe('Main Project');
    });

    test('can traverse from task to project owner user', function () {
        $user = User::factory()->create(['name' => 'Alice']);
        $project = Project::factory()->create(['user_id' => $user->id]);
        $task = Task::factory()->create(['project_id' => $project->id]);

        expect($task->project->user->id)->toBe($user->id)
            ->and($task->project->user->name)->toBe('Alice');
    });

    test('a user can have multiple assigned tasks', function () {
        $user = User::factory()->create();
        $project = Project::factory()->create(['user_id' => $user->id]);

        $task1 = Task::factory()->create(['user_id' => $user->id, 'project_id' => $project->id, 'title' => 'Task 1']);
        $task2 = Task::factory()->create(['user_id' => $user->id, 'project_id' => $project->id, 'title' => 'Task 2']);

        expect($user->tasks)->toHaveCount(2)
            ->and($user->tasks->pluck('id')->all())->toContain($task1->id, $task2->id);
    });

    test('a task belongs to an assigned user', function () {
        $user = User::factory()->create(['name' => 'Bob']);
        $project = Project::factory()->create(['user_id' => $user->id]);
        $task = Task::factory()->create(['user_id' => $user->id, 'project_id' => $project->id]);

        expect($task->user)->not->toBeNull()
            ->and($task->user->id)->toBe($user->id)
            ->and($task->user->name)->toBe('Bob');
    });

    test('a user can have multiple roles and a role can have multiple users', function () {
        $user = User::factory()->create();
        $adminRole = Role::create(['name' => 'admin', 'description' => 'Administrator']);
        $memberRole = Role::create(['name' => 'member', 'description' => 'Member']);

        $user->roles()->attach([$adminRole->id, $memberRole->id]);

        expect($user->roles)->toHaveCount(2)
            ->and($user->roles->pluck('name')->all())->toContain('admin', 'member')
            ->and($adminRole->users->first()->id)->toBe($user->id);
    });

    test('deleting a user removes user_roles pivot entries without deleting the role', function () {
        $user = User::factory()->create();
        $role = Role::create(['name' => 'editor']);
        $user->roles()->attach($role->id);

        $user->delete();

        expect(Role::find($role->id))->not->toBeNull()
            ->and($role->fresh()->users)->toBeEmpty();
    });

    test('deleting a role removes user_roles pivot entries without deleting the user', function () {
        $user = User::factory()->create();
        $role = Role::create(['name' => 'viewer']);
        $user->roles()->attach($role->id);

        $role->delete();

        expect(User::find($user->id))->not->toBeNull()
            ->and($user->fresh()->roles)->toBeEmpty();
    });

    test('deleting a user cascades and removes their projects and tasks', function () {
        $user = User::factory()->create();
        $project = Project::factory()->create(['user_id' => $user->id]);
        $task = Task::factory()->create(['project_id' => $project->id, 'user_id' => $user->id]);

        $user->delete();

        expect(Project::find($project->id))->toBeNull()
            ->and(Task::find($task->id))->toBeNull();
    });

    test('deleting a project cascades and removes its tasks', function () {
        $project = Project::factory()->create();
        $task = Task::factory()->create(['project_id' => $project->id]);

        $project->delete();

        expect(Task::find($task->id))->toBeNull();
    });
});
