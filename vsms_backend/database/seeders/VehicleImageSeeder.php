<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VehicleImageSeeder extends Seeder
{
    public function run()
    {
        // Add vehicles 9 and 10 since they were missed previously
        DB::table('vehicle_images')->insert([
            ['vehicle_id' => 9, 'image_category' => 'frontView', 'image_url' => '/vehicles/mazda_cx5.png'],
            ['vehicle_id' => 10, 'image_category' => 'frontView', 'image_url' => '/vehicles/chevrolet_silverado_new.png']
        ]);
    }
}
