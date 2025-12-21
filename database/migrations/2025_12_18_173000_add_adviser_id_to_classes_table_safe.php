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
        // Check if column doesn't exist before adding
        if (!Schema::hasColumn('classes', 'adviser_id')) {
            Schema::table('classes', function (Blueprint $table) {
                $table->unsignedBigInteger('adviser_id')->nullable()->after('semester_id');
                
                // Add foreign key constraint
                $table->foreign('adviser_id')
                    ->references('id')
                    ->on('teachers')
                    ->onDelete('set null');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('classes', 'adviser_id')) {
            Schema::table('classes', function (Blueprint $table) {
                $table->dropForeign(['adviser_id']);
                $table->dropColumn('adviser_id');
            });
        }
    }
};





