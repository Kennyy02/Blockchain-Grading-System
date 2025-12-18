<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * This is a simplified version that just adds the missing columns
     * without complex logic that might fail
     */
    public function up(): void
    {
        // First, check current state of the table
        $hasSubjectId = Schema::hasColumn('course_materials', 'subject_id');
        $hasFileMimeType = Schema::hasColumn('course_materials', 'file_mime_type');
        $hasFileSize = Schema::hasColumn('course_materials', 'file_size');
        $hasUploadedBy = Schema::hasColumn('course_materials', 'uploaded_by');
        $hasClassSubjectId = Schema::hasColumn('course_materials', 'class_subject_id');

        // Add subject_id if it doesn't exist
        if (!$hasSubjectId) {
            Schema::table('course_materials', function (Blueprint $table) {
                $table->unsignedBigInteger('subject_id')->nullable()->after('id');
            });
            
            // If we have class_subject_id, migrate the data
            if ($hasClassSubjectId) {
                DB::statement('
                    UPDATE course_materials 
                    SET subject_id = (
                        SELECT subject_id FROM class_subjects 
                        WHERE class_subjects.id = course_materials.class_subject_id
                        LIMIT 1
                    )
                    WHERE class_subject_id IS NOT NULL
                ');
            }
        }

        // Add file_mime_type if it doesn't exist
        if (!$hasFileMimeType) {
            Schema::table('course_materials', function (Blueprint $table) {
                $table->string('file_mime_type')->nullable()->after('file_path');
            });
        }

        // Add file_size if it doesn't exist
        if (!$hasFileSize) {
            Schema::table('course_materials', function (Blueprint $table) {
                $table->unsignedBigInteger('file_size')->nullable()->after('file_mime_type');
            });
        }

        // Add uploaded_by if it doesn't exist
        if (!$hasUploadedBy) {
            Schema::table('course_materials', function (Blueprint $table) {
                $table->unsignedBigInteger('uploaded_by')->nullable()->after('file_size');
            });
        }

        // Drop class_subject_id if it still exists and we have subject_id
        if ($hasClassSubjectId && $hasSubjectId) {
            try {
                Schema::table('course_materials', function (Blueprint $table) {
                    // Try to drop foreign key first
                    $foreignKeys = DB::select("
                        SELECT CONSTRAINT_NAME 
                        FROM information_schema.KEY_COLUMN_USAGE 
                        WHERE TABLE_SCHEMA = DATABASE() 
                        AND TABLE_NAME = 'course_materials' 
                        AND COLUMN_NAME = 'class_subject_id'
                        AND CONSTRAINT_NAME != 'PRIMARY'
                    ");
                    
                    foreach ($foreignKeys as $fk) {
                        DB::statement("ALTER TABLE course_materials DROP FOREIGN KEY {$fk->CONSTRAINT_NAME}");
                    }
                    
                    $table->dropColumn('class_subject_id');
                });
            } catch (\Exception $e) {
                \Log::warning('Could not drop class_subject_id: ' . $e->getMessage());
            }
        }

        // Add foreign key constraints if they don't exist
        if ($hasSubjectId) {
            try {
                $fkExists = DB::select("
                    SELECT CONSTRAINT_NAME 
                    FROM information_schema.KEY_COLUMN_USAGE 
                    WHERE TABLE_SCHEMA = DATABASE() 
                    AND TABLE_NAME = 'course_materials' 
                    AND COLUMN_NAME = 'subject_id'
                    AND REFERENCED_TABLE_NAME = 'subjects'
                ");
                
                if (empty($fkExists)) {
                    Schema::table('course_materials', function (Blueprint $table) {
                        $table->foreign('subject_id')->references('id')->on('subjects')->onDelete('cascade');
                    });
                }
            } catch (\Exception $e) {
                \Log::warning('Could not add subject_id foreign key: ' . $e->getMessage());
            }
        }

        if ($hasUploadedBy) {
            try {
                $fkExists = DB::select("
                    SELECT CONSTRAINT_NAME 
                    FROM information_schema.KEY_COLUMN_USAGE 
                    WHERE TABLE_SCHEMA = DATABASE() 
                    AND TABLE_NAME = 'course_materials' 
                    AND COLUMN_NAME = 'uploaded_by'
                    AND REFERENCED_TABLE_NAME = 'users'
                ");
                
                if (empty($fkExists)) {
                    Schema::table('course_materials', function (Blueprint $table) {
                        $table->foreign('uploaded_by')->references('id')->on('users')->onDelete('set null');
                    });
                }
            } catch (\Exception $e) {
                \Log::warning('Could not add uploaded_by foreign key: ' . $e->getMessage());
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('course_materials', function (Blueprint $table) {
            // Drop foreign keys if they exist
            try {
                $table->dropForeign(['subject_id']);
            } catch (\Exception $e) {}
            
            try {
                $table->dropForeign(['uploaded_by']);
            } catch (\Exception $e) {}
            
            // Drop columns
            if (Schema::hasColumn('course_materials', 'file_mime_type')) {
                $table->dropColumn('file_mime_type');
            }
            if (Schema::hasColumn('course_materials', 'file_size')) {
                $table->dropColumn('file_size');
            }
            if (Schema::hasColumn('course_materials', 'uploaded_by')) {
                $table->dropColumn('uploaded_by');
            }
            if (Schema::hasColumn('course_materials', 'subject_id')) {
                $table->dropColumn('subject_id');
            }
        });
    }
};

