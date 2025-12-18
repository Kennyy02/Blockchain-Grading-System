<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add gender to teachers table if it doesn't exist
        if (!Schema::hasColumn('teachers', 'gender')) {
            Schema::table('teachers', function (Blueprint $table) {
                $table->enum('gender', ['Male', 'Female'])->nullable()->after('email');
            });
        }

        // Add gender to parents table if it doesn't exist
        if (!Schema::hasColumn('parents', 'gender')) {
            Schema::table('parents', function (Blueprint $table) {
                $table->enum('gender', ['Male', 'Female'])->nullable()->after('email');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('teachers', 'gender')) {
            Schema::table('teachers', function (Blueprint $table) {
                $table->dropColumn('gender');
            });
        }

        if (Schema::hasColumn('parents', 'gender')) {
            Schema::table('parents', function (Blueprint $table) {
                $table->dropColumn('gender');
            });
        }
    }
};

